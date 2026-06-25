(function () {
    const config = {
        maxParticipants: 1000,
        initialStock: 200,
        staffPin: "0528",
        storageKey: "kh-herbal-market-mock-state-v2",
        recentRecordLimit: 50,
        fortunes: {
            metal: {
                key: "metal",
                element: "金",
                title: "金行．清明籤",
                keyword: "俐落收束，貴人近身",
                color: "#b88a2b",
                teaName: "杞菊決明炯炯茶",
                teaImage: "heat-product.jpg",
                ingredients: ["枸杞", "菊花", "決明子"],
                concept: "以清亮草本調性對應金行的俐落與明晰，適合在步調緊湊的一天裡，幫自己留下一段整理思緒的空白。",
                message: "今天適合做決定、做收斂，也適合把手邊零碎的事一口氣理順。把焦點放在真正重要的人與事，反而更容易遇到推你一把的貴人。",
                poem: "雲開秋宇淨，\n一念見分明。\n善守心中度，\n佳音近戶庭。",
                introCopy: "清明、專注、帶來俐落的開展"
            },
            wood: {
                key: "wood",
                element: "木",
                title: "木行．舒展籤",
                keyword: "心念舒展，人緣漸旺",
                color: "#527458",
                teaName: "金銀魚腥七葉茶",
                teaImage: "yu-product.jpg",
                ingredients: ["金銀花", "魚腥草", "七葉膽"],
                concept: "以清新草本香氣描繪木行的伸展感，讓整體氣息從緊繃轉為流動，更貼近市集中自在穿梭、與人互動的節奏。",
                message: "今天適合往外走、和人聊天、把想法說出口。你不需要太用力，順著氣氛自然展開，新的靈感與合作就會自己冒出來。",
                poem: "春意入枝頭，\n新芽帶好風。\n一心常舒朗，\n來往自相逢。",
                introCopy: "舒心、清爽、適合展開一段新對話"
            },
            water: {
                key: "water",
                element: "水",
                title: "水行．潤聲籤",
                keyword: "沉著安定，靈感回流",
                color: "#4c6f81",
                teaName: "潤喉養聲羅漢茶",
                teaImage: "",
                ingredients: ["羅漢果", "膨大海", "桔梗"],
                concept: "以潤澤口感與溫和草本印象對應水行，讓節奏放慢之後，思緒更容易沉澱，講話與待人也更顯從容。",
                message: "今天不一定是最快的一天，但很適合沉著前進。當你願意把速度放下，反而能更清楚聽見自己的判斷，說出口的話也更有份量。",
                poem: "靜水涵微光，\n回聲入夜長。\n緩行多定力，\n好運自迴廊。",
                introCopy: "潤澤、安定、讓節奏慢下來"
            },
            fire: {
                key: "fire",
                element: "火",
                title: "火行．旺勢籤",
                keyword: "人氣上揚，行動見成",
                color: "#b85634",
                teaName: "高麗蔘養氣茶",
                teaImage: "qi-product.jpg",
                ingredients: ["高麗參", "枸杞", "紅棗"],
                concept: "以溫潤厚實的配方描繪火行的熱度與行動力，讓精神感和氣勢更完整，適合當成今天的開運主角。",
                message: "今天的你比較有存在感，適合主動開口、主動出手、主動把機會抓到自己手裡。只要方向清楚，氣勢就會替你把場面帶起來。",
                poem: "晨光照心府，\n好勢逐人來。\n舉步多成事，\n紅雲入掌開。",
                introCopy: "元氣、暖意、適合點亮今天的氣場"
            },
            earth: {
                key: "earth",
                element: "土",
                title: "土行．厚福籤",
                keyword: "穩穩累積，安心入袋",
                color: "#9c7549",
                teaName: "經典養生元氣茶",
                teaImage: "special-product.jpg",
                ingredients: ["紅棗", "枸杞", "黃耆"],
                concept: "以溫和經典的草本組合對應土行的穩定感，適合日常保養與步調整理，也讓這張籤詩更貼近市集贈禮的安心印象。",
                message: "今天的好運不是突然爆發，而是一步一步累積出來的。只要把眼前的小事照顧好，後面的節奏就會更穩，收穫也比較紮實。",
                poem: "厚土承百穀，\n安然聚暖香。\n守成添好運，\n福意在身旁。",
                introCopy: "穩定、厚實、適合慢慢把好運存起來"
            }
        },
        order: ["metal", "wood", "water", "fire", "earth"]
    };

    window.HerbalMarketConfig = config;
})();
