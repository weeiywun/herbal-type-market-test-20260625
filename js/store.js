(function () {
    const config = window.HerbalMarketConfig;
    if (!config) {
        throw new Error("HerbalMarketConfig is required before store.js");
    }

    function createDefaultState() {
        const inventory = {};
        config.order.forEach((key) => {
            inventory[key] = {
                initial: config.initialStock,
                claimed: 0
            };
        });

        return {
            drawCount: 0,
            claimCount: 0,
            inventory,
            records: []
        };
    }

    function loadState() {
        const raw = localStorage.getItem(config.storageKey);
        if (!raw) {
            return createDefaultState();
        }

        try {
            const parsed = JSON.parse(raw);
            return normalizeState(parsed);
        } catch (error) {
            return createDefaultState();
        }
    }

    function normalizeState(input) {
        const base = createDefaultState();
        const state = {
            drawCount: Number.isFinite(input.drawCount) ? input.drawCount : 0,
            claimCount: Number.isFinite(input.claimCount) ? input.claimCount : 0,
            inventory: base.inventory,
            records: Array.isArray(input.records) ? input.records : []
        };

        config.order.forEach((key) => {
            if (input.inventory && input.inventory[key]) {
                state.inventory[key] = {
                    initial: Number.isFinite(input.inventory[key].initial) ? input.inventory[key].initial : config.initialStock,
                    claimed: Number.isFinite(input.inventory[key].claimed) ? input.inventory[key].claimed : 0
                };
            }
        });

        return state;
    }

    function saveState(state) {
        localStorage.setItem(config.storageKey, JSON.stringify(state));
    }

    function remainingFor(state, key) {
        const item = state.inventory[key];
        return Math.max(0, item.initial - item.claimed);
    }

    function totalRemaining(state) {
        return config.order.reduce((sum, key) => sum + remainingFor(state, key), 0);
    }

    function pendingCount(state) {
        return Math.max(0, state.drawCount - state.claimCount);
    }

    function weightedDraw(state) {
        const pool = config.order
            .map((key) => ({ key, remaining: remainingFor(state, key) }))
            .filter((item) => item.remaining > 0);

        if (!pool.length) {
            return null;
        }

        const total = pool.reduce((sum, item) => sum + item.remaining, 0);
        let cursor = Math.random() * total;

        for (const item of pool) {
            cursor -= item.remaining;
            if (cursor <= 0) {
                return item.key;
            }
        }

        return pool[pool.length - 1].key;
    }

    function formatCode(index) {
        return `NO. ${String(index).padStart(4, "0")}`;
    }

    function generateTicketId(index) {
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `KHM-${String(index).padStart(4, "0")}-${suffix}`;
    }

    function generateSlipNo() {
        return Math.floor(Math.random() * 100) + 1;
    }

    function generateLuck() {
        const list = ["大吉", "吉", "小吉"];
        return list[Math.floor(Math.random() * list.length)];
    }

    function createPendingDraw(sourceKey) {
        const state = loadState();

        if (state.drawCount >= config.maxParticipants) {
            return { ok: false, reason: "limit" };
        }

        const resultKey = weightedDraw(state);
        if (!resultKey) {
            return { ok: false, reason: "stock" };
        }

        state.drawCount += 1;
        const record = {
            id: generateTicketId(state.drawCount),
            code: formatCode(state.drawCount),
            sourceKey,
            resultKey,
            slipNo: generateSlipNo(),
            luck: generateLuck(),
            status: "pending",
            createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
            claimedAt: null
        };

        state.records.unshift(record);
        state.records = state.records.slice(0, config.recentRecordLimit);
        saveState(state);

        return { ok: true, record, state: getSnapshotFromState(state) };
    }

    function claimTicket(ticketId, pin) {
        const state = loadState();

        if (pin !== config.staffPin) {
            return { ok: false, reason: "pin" };
        }

        const record = state.records.find((item) => item.id === ticketId);
        if (!record) {
            return { ok: false, reason: "not_found" };
        }

        if (record.status === "claimed") {
            return { ok: false, reason: "claimed" };
        }

        if (remainingFor(state, record.resultKey) <= 0) {
            return { ok: false, reason: "stock" };
        }

        state.inventory[record.resultKey].claimed += 1;
        state.claimCount += 1;
        record.status = "claimed";
        record.claimedAt = new Date().toLocaleString("zh-TW", { hour12: false });
        saveState(state);

        return { ok: true, record, state: getSnapshotFromState(state) };
    }

    function findRecordByTicketId(ticketId) {
        const state = loadState();
        return state.records.find((item) => item.id.toUpperCase() === String(ticketId || "").trim().toUpperCase()) || null;
    }

    function getSnapshotFromState(state) {
        return {
            drawCount: state.drawCount,
            claimCount: state.claimCount,
            pendingCount: pendingCount(state),
            totalRemaining: totalRemaining(state),
            inventory: config.order.map((key) => ({
                key,
                remaining: remainingFor(state, key),
                initial: state.inventory[key].initial,
                claimed: state.inventory[key].claimed
            })),
            records: state.records.slice(),
            pendingRecords: state.records.filter((item) => item.status === "pending")
        };
    }

    function getSnapshot() {
        return getSnapshotFromState(loadState());
    }

    window.HerbalMarketStore = {
        createPendingDraw,
        claimTicket,
        findRecordByTicketId,
        getSnapshot
    };
})();
