(function () {
    const config = window.HerbalMarketConfig;
    const store = window.HerbalMarketStore;
    const fortunes = config.fortunes;

    function showScreen(id) {
        document.querySelectorAll(".page").forEach((page) => {
            page.classList.toggle("active", page.id === id);
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function renderIntroElements() {
        const target = document.getElementById("intro-elements");
        target.innerHTML = config.order.map((key) => {
            const item = fortunes[key];
            return `
                <article class="seal-item">
                    <strong style="color:${item.color}">${item.element}</strong>
                    <div>
                        <h3>${item.teaName}</h3>
                        <p>${item.introCopy}</p>
                    </div>
                </article>
            `;
        }).join("");
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

    function renderResult(record) {
        const item = fortunes[record.resultKey];
        document.getElementById("ticket-code").textContent = record.code;
        document.getElementById("claim-code").textContent = record.id;
        document.getElementById("ticket-element").textContent = item.element;
        document.getElementById("result-keyword").textContent = item.keyword;
        document.getElementById("yj-num").textContent = record.slipNo;
        document.getElementById("yj-luck").textContent = `◈ ${record.luck} ◈`;
        document.getElementById("yj-persona-name").textContent = item.title;
        document.getElementById("result-poem").textContent = `「${item.poem}」`;
        document.getElementById("result-message").textContent = item.message;
        document.getElementById("tea-name").textContent = item.teaName;
        document.getElementById("tea-story").textContent = item.concept;
        document.getElementById("tea-ingredients").innerHTML = item.ingredients.map((ingredient) => `<span>${ingredient}</span>`).join("");
        document.getElementById("gift-visual").innerHTML = renderGiftVisual(item);
        document.getElementById("result-side-title").textContent = item.introCopy;
        document.getElementById("result-side-copy").textContent = "工作人員將依此領獎碼進行覆核。後續接 Supabase 後，這個碼會對應正式的 pending 紀錄。";
    }

    function clearRevealState() {
        document.querySelectorAll(".ritual-token").forEach((token) => {
            token.classList.remove("is-selected");
        });
    }

    function startDraw() {
        const trigger = document.getElementById("ritual-trigger");
        const orbit = document.getElementById("ritual-orbit");

        if (trigger.disabled) {
            return;
        }

        const result = store.createPendingDraw("ritual-entry");
        if (!result.ok) {
            if (result.reason === "limit") {
                showToast("目前參與名額已達上限");
            } else {
                showToast("今日禮品已全數領完");
            }
            return;
        }

        trigger.disabled = true;
        clearRevealState();
        orbit.classList.remove("reveal");
        orbit.classList.add("spinning");

        setTimeout(() => {
            orbit.classList.remove("spinning");
            orbit.classList.add("reveal");
            const selected = document.querySelector(`.token-${result.record.resultKey}`);
            if (selected) {
                selected.classList.add("is-selected");
            }
        }, 1100);

        setTimeout(() => {
            renderResult(result.record);
            showScreen("result-screen");
            trigger.disabled = false;
            orbit.classList.remove("reveal");
            clearRevealState();
        }, 1800);
    }

    function bindEvents() {
        document.getElementById("start-draw").addEventListener("click", () => showScreen("draw-screen"));
        document.getElementById("ritual-trigger").addEventListener("click", startDraw);
        document.querySelectorAll("[data-screen-target]").forEach((node) => {
            node.addEventListener("click", () => showScreen(node.dataset.screenTarget));
        });
    }

    renderIntroElements();
    bindEvents();
})();
