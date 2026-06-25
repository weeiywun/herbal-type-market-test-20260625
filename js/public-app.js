(function () {
    const config = window.HerbalMarketConfig;
    const store = window.HerbalMarketStore;
    const fortunes = config.fortunes;

    const elementGuide = {
        metal: {
            name: "金",
            title: "金，像收斂與澄明",
            copy: "對應秋氣與整理。當你需要更俐落地收束思緒、辨明界線，或把散落的注意力重新聚攏時，金的節奏就會特別明顯。"
        },
        wood: {
            name: "木",
            title: "木，像舒展與生發",
            copy: "對應春氣與冒芽。它提醒人往前生長、把卡住的感受慢慢打開，也象徵一種願意重新開始、讓自己恢復彈性的力量。"
        },
        water: {
            name: "水",
            title: "水，像沉靜與藏養",
            copy: "對應冬氣與潛藏。當你需要安靜下來、回到內在、讓疲憊慢慢沉澱時，水的能量會讓人知道，休息本身也是一種前進。"
        },
        fire: {
            name: "火",
            title: "火，像光亮與流動",
            copy: "對應夏氣與外放。它帶來熱度、表達與感受力，也提醒人留意自己是否正在燃燒熱情，或需要重新點亮心裡那一束光。"
        },
        earth: {
            name: "土",
            title: "土，像承接與安定",
            copy: "對應四時之間的轉換。它像把萬物接住的地面，提醒人回到安穩、照顧日常、整理節奏，也讓改變有了可以落腳的地方。"
        }
    };

    const drawerLabels = [
        "當歸",
        "黃耆",
        "枸杞",
        "白芷",
        "薄荷",
        "陳皮",
        "決明",
        "紅棗",
        "甘草"
    ];

    const particlePalette = {
        metal: "#f3d17c",
        wood: "#9ad38d",
        water: "#8dc0db",
        fire: "#e58c62",
        earth: "#c8a06b"
    };

    const state = {
        drawTimers: [],
        activeRecord: null,
        activeDrawerIndex: null,
        drawLocked: false
    };

    function showScreen(id) {
        document.querySelectorAll(".page").forEach((page) => {
            page.classList.toggle("active", page.id === id);
        });

        if (id === "draw-screen") {
            primeCabinetStage();
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function vibrate(pattern) {
        if (window.navigator && typeof window.navigator.vibrate === "function") {
            window.navigator.vibrate(pattern);
        }
    }

    function schedule(callback, delay) {
        const timer = window.setTimeout(callback, delay);
        state.drawTimers.push(timer);
        return timer;
    }

    function clearScheduledTimers() {
        state.drawTimers.forEach((timer) => window.clearTimeout(timer));
        state.drawTimers = [];
    }

    function renderIntroElements() {
        const target = document.getElementById("intro-elements");
        target.innerHTML = config.order.map((key) => {
            const guide = elementGuide[key];
            return `
                <article class="seal-item">
                    <strong style="color:${fortunes[key].color}">${guide.name}</strong>
                    <div>
                        <h3>${guide.title}</h3>
                        <p>${guide.copy}</p>
                    </div>
                </article>
            `;
        }).join("");
    }

    function renderDrawerCabinet() {
        const grid = document.getElementById("cabinet-grid");
        if (!grid || grid.children.length) {
            return;
        }

        grid.innerHTML = drawerLabels.map((label, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const distance = Math.abs(row - 1) + Math.abs(col - 1);
            const delay = 60 + distance * 110;
            const decorativeElement = config.order[index % config.order.length];
            return `
                <button
                    class="cabinet-drawer"
                    type="button"
                    data-drawer-index="${index}"
                    data-decorative-element="${decorativeElement}"
                    aria-label="開啟${label}抽屜"
                    style="--intro-delay:${delay}ms"
                >
                    <span class="drawer-inner" aria-hidden="true">
                        <span class="drawer-inner-copy">${fortunes[decorativeElement].element}</span>
                    </span>
                    <span class="drawer-front">
                        <span class="drawer-label">${label}</span>
                        <span class="drawer-pull" aria-hidden="true"></span>
                    </span>
                </button>
            `;
        }).join("");
    }

    function primeCabinetStage() {
        renderDrawerCabinet();
        resetCabinetState({ keepReady: false });
        const scene = document.getElementById("cabinet-scene");
        window.requestAnimationFrame(() => {
            scene.classList.add("is-ready");
        });
    }

    function resetCabinetState(options = {}) {
        const { keepReady } = options;
        clearScheduledTimers();
        state.drawLocked = false;
        state.activeRecord = null;
        state.activeDrawerIndex = null;

        const scene = document.getElementById("cabinet-scene");
        const reveal = document.getElementById("fortune-reveal");
        const particles = document.getElementById("drawer-particles");
        const continueButton = document.getElementById("fortune-continue");

        scene.className = "cabinet-scene";
        if (keepReady) {
            scene.classList.add("is-ready");
        }

        reveal.className = "fortune-reveal";
        particles.innerHTML = "";
        continueButton.disabled = true;

        document.querySelectorAll(".cabinet-drawer").forEach((drawer) => {
            drawer.classList.remove("is-selected", "is-opening", "is-opened");
            drawer.disabled = false;
        });
    }

    function renderGiftVisual(item) {
        if (item.teaImage) {
            return `<img src="./${item.teaImage}" alt="${item.teaName}">`;
        }

        return `
            <div class="gift-placeholder" style="color:${item.color}">
                <strong>${item.element}</strong>
                <div style="margin-top:10px;font-weight:700;">${item.teaName}</div>
            </div>
        `;
    }

    function renderRevealCard(record) {
        const item = fortunes[record.resultKey];
        document.getElementById("reveal-title").textContent = `${item.element}行為你開出今日籤意`;
        document.getElementById("reveal-copy").textContent = `${item.title}。先讓籤卷停在中央，再按下方按鈕揭曉完整內容。`;
        document.getElementById("fortune-continue").disabled = true;
    }

    function renderResult(record) {
        const item = fortunes[record.resultKey];
        document.getElementById("ticket-code").textContent = record.code;
        document.getElementById("claim-code").textContent = record.id;
        document.getElementById("ticket-element").textContent = item.element;
        document.getElementById("result-keyword").textContent = item.keyword;
        document.getElementById("yj-num").textContent = record.slipNo;
        document.getElementById("yj-luck").textContent = record.luck;
        document.getElementById("yj-persona-name").textContent = item.title;
        document.getElementById("result-poem").textContent = item.poem;
        document.getElementById("result-message").textContent = item.message;
        document.getElementById("tea-name").textContent = item.teaName;
        document.getElementById("tea-story").textContent = item.concept;
        document.getElementById("tea-ingredients").innerHTML = item.ingredients.map((ingredient) => `<span>${ingredient}</span>`).join("");
        document.getElementById("gift-visual").innerHTML = renderGiftVisual(item);
        document.getElementById("result-side-title").textContent = item.introCopy;
        document.getElementById("result-side-copy").textContent = "完成抽籤後，請將此頁面交由現場工作人員核對。領取內容與後續說明皆以現場流程為準。";
    }

    function createParticles(resultKey, drawerIndex) {
        const particles = document.getElementById("drawer-particles");
        const scene = document.getElementById("cabinet-scene");
        const drawer = document.querySelector(`.cabinet-drawer[data-drawer-index="${drawerIndex}"]`);
        if (!particles || !scene || !drawer) {
            return;
        }

        const sceneRect = scene.getBoundingClientRect();
        const drawerRect = drawer.getBoundingClientRect();
        const originX = drawerRect.left - sceneRect.left + drawerRect.width / 2;
        const originY = drawerRect.top - sceneRect.top + drawerRect.height / 2;
        const color = particlePalette[resultKey];

        particles.innerHTML = Array.from({ length: 18 }, (_, index) => {
            const angle = (-95 + index * 10) * (Math.PI / 180);
            const distance = 54 + Math.random() * 140;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            const size = 8 + Math.random() * 10;
            const rot = `${Math.round(Math.random() * 320 - 160)}deg`;

            return `
                <span
                    class="particle"
                    style="
                        left:${originX}px;
                        top:${originY}px;
                        --dx:${dx.toFixed(1)}px;
                        --dy:${dy.toFixed(1)}px;
                        --size:${size.toFixed(1)}px;
                        --rot:${rot};
                        --particle-color:${color};
                    "
                ></span>
            `;
        }).join("");
    }

    function startDraw(drawerIndex) {
        if (state.drawLocked) {
            return;
        }

        const result = store.createPendingDraw("cabinet-drawer");
        if (!result.ok) {
            showToast(result.reason === "limit" ? "今日抽籤名額已滿。" : "目前沒有可抽取的內容。");
            return;
        }

        state.drawLocked = true;
        state.activeRecord = result.record;
        state.activeDrawerIndex = Number.isInteger(drawerIndex) ? drawerIndex : (result.record.slipNo % drawerLabels.length);

        const scene = document.getElementById("cabinet-scene");
        const reveal = document.getElementById("fortune-reveal");
        const continueButton = document.getElementById("fortune-continue");
        const selectedDrawer = document.querySelector(`.cabinet-drawer[data-drawer-index="${state.activeDrawerIndex}"]`);

        renderRevealCard(result.record);
        document.querySelectorAll(".cabinet-drawer").forEach((drawer) => {
            drawer.disabled = true;
        });

        selectedDrawer.classList.add("is-selected", "is-opening");
        scene.classList.add("is-ready", "is-focused", "is-opening");
        vibrate([50, 100, 50]);

        schedule(() => {
            selectedDrawer.classList.add("is-opened");
            scene.classList.add("is-releasing");
            createParticles(result.record.resultKey, state.activeDrawerIndex);
            vibrate(40);
        }, 1180);

        schedule(() => {
            reveal.classList.add("is-visible");
            scene.classList.add("is-revealing");
        }, 1420);

        schedule(() => {
            reveal.classList.add("is-unrolled");
        }, 2220);

        schedule(() => {
            reveal.classList.add("is-copy-visible");
            scene.classList.add("is-disclosed");
            continueButton.disabled = false;
        }, 2860);
    }

    function continueToResult() {
        if (!state.activeRecord) {
            return;
        }

        renderResult(state.activeRecord);
        resetCabinetState({ keepReady: true });
        showScreen("result-screen");
    }

    function bindEvents() {
        document.getElementById("start-draw").addEventListener("click", () => showScreen("draw-screen"));
        document.getElementById("fortune-continue").addEventListener("click", continueToResult);

        document.querySelectorAll("[data-screen-target]").forEach((node) => {
            node.addEventListener("click", () => {
                const target = node.dataset.screenTarget;
                if (target === "draw-screen") {
                    primeCabinetStage();
                }
                showScreen(target);
            });
        });

        document.getElementById("cabinet-grid").addEventListener("click", (event) => {
            const drawer = event.target.closest(".cabinet-drawer");
            if (!drawer) {
                return;
            }

            startDraw(Number(drawer.dataset.drawerIndex));
        });
    }

    renderIntroElements();
    renderDrawerCabinet();
    bindEvents();
})();
