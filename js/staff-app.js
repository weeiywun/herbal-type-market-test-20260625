(function () {
    const config = window.HerbalMarketConfig;
    const store = window.HerbalMarketStore;
    const fortunes = config.fortunes;

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function renderMetrics(snapshot) {
        document.getElementById("metric-draws").textContent = snapshot.drawCount;
        document.getElementById("metric-claimed").textContent = snapshot.claimCount;
        document.getElementById("metric-pending").textContent = snapshot.pendingCount;
        document.getElementById("metric-remaining").textContent = snapshot.totalRemaining;
    }

    function renderInventory(snapshot) {
        const target = document.getElementById("inventory-list");
        target.innerHTML = snapshot.inventory.map((item) => {
            const fortune = fortunes[item.key];
            const pct = item.initial ? (item.remaining / item.initial) * 100 : 0;
            return `
                <div class="inventory-item">
                    <div class="inventory-chip" style="background:${fortune.color}">${fortune.element}</div>
                    <div>
                        <div class="item-title">${fortune.teaName}</div>
                        <div class="inventory-bar"><span style="width:${pct}%;background:${fortune.color};"></span></div>
                    </div>
                    <div class="meta-small" style="text-align:right;">${item.remaining} / ${item.initial}</div>
                </div>
            `;
        }).join("");
    }

    function createRecordMarkup(record, withAction) {
        const item = fortunes[record.resultKey];
        const action = withAction
            ? `<button class="button button-secondary" type="button" data-fill-ticket="${record.id}">帶入領獎碼</button>`
            : `<div class="status-chip ${record.status}">${record.status === "claimed" ? "已領獎" : "待覆核"}</div>`;

        const timeLabel = record.status === "claimed" && record.claimedAt
            ? `領獎：${record.claimedAt}`
            : `抽籤：${record.createdAt}`;

        return `
            <div class="${withAction ? "pending-item" : `record-item ${record.status}`}">
                <div>
                    <div class="meta-small">${record.code}</div>
                    <div class="item-title">${record.id}</div>
                </div>
                <div>
                    <div class="item-title" style="color:${item.color}">${item.element}行｜${item.teaName}</div>
                    <div class="meta-small">${timeLabel}</div>
                </div>
                ${action}
            </div>
        `;
    }

    function bindFillTicketButtons() {
        document.querySelectorAll("[data-fill-ticket]").forEach((button) => {
            button.addEventListener("click", () => {
                document.getElementById("claim-code-input").value = button.dataset.fillTicket;
                document.getElementById("claim-pin-input").focus();
            });
        });
    }

    function renderPending(snapshot) {
        const target = document.getElementById("pending-list");
        if (!snapshot.pendingRecords.length) {
            target.innerHTML = `<div class="pending-empty">目前沒有待覆核的領獎紀錄。</div>`;
            return;
        }

        target.innerHTML = snapshot.pendingRecords.map((record) => createRecordMarkup(record, true)).join("");
        bindFillTicketButtons();
    }

    function renderRecords(snapshot) {
        const target = document.getElementById("record-list");
        if (!snapshot.records.length) {
            target.innerHTML = `<div class="record-empty">目前尚未有抽籤紀錄。</div>`;
            return;
        }

        target.innerHTML = snapshot.records.slice(0, 12).map((record) => createRecordMarkup(record, false)).join("");
    }

    function renderAll() {
        const snapshot = store.getSnapshot();
        renderMetrics(snapshot);
        renderInventory(snapshot);
        renderPending(snapshot);
        renderRecords(snapshot);
    }

    function handleClaim() {
        const ticketId = document.getElementById("claim-code-input").value.trim();
        const pin = document.getElementById("claim-pin-input").value.trim();

        if (!ticketId) {
            showToast("請輸入領獎碼");
            return;
        }

        const result = store.claimTicket(ticketId, pin);
        if (!result.ok) {
            const messages = {
                pin: "工作人員密碼錯誤",
                not_found: "找不到此領獎碼",
                claimed: "這張票券已完成領獎",
                stock: "該茶包目前已無庫存"
            };
            showToast(messages[result.reason] || "領獎失敗");
            return;
        }

        document.getElementById("claim-code-input").value = "";
        document.getElementById("claim-pin-input").value = "";
        renderAll();
        showToast("已完成領獎與庫存扣除");
    }

    function bindEvents() {
        document.getElementById("claim-button").addEventListener("click", handleClaim);
        document.getElementById("refresh-button").addEventListener("click", renderAll);
        window.addEventListener("storage", renderAll);
        document.getElementById("claim-pin-input").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                handleClaim();
            }
        });
    }

    renderAll();
    bindEvents();
})();
