import { getData, saveData, buttonMenuToggle, toggleLanguages, mobileThemeColor } from "./helpers.js";

const settingsButton = document.querySelector(".settings-button");
const settingsMenuWrapper = document.querySelector(".settings-menu-wrapper");
const settingsMenu = document.querySelector(".settings-menu");

settingsButton.addEventListener("click", () => buttonMenuToggle(settingsMenuWrapper));

const goHomeBtn = document.querySelector(".go-home-btn");
const goUpBtn = document.querySelector(".go-up-btn");
const headerTitleWrapper = document.querySelector(".header-title-wrapper");

const settingOptions = [
    {
        option: "Theme",
        themes: [
            "light",
            "dark",
            "dark-blue",
            "sepia",
            "purple",
            "green"
        ]
    },
    {
        option: "Font Size"
    },
    {
        option: "Languages",
        languages: [
            "arabic",
            "english"
        ]
    }
]

for (let i = 0; i < settingOptions.length; i++) {
    const setting = settingOptions[i];

    const settingBox = document.createElement("div");
    settingBox.classList.add("setting-box");
    settingsMenu.append(settingBox);

    const settingName = document.createElement("h4");
    settingName.classList.add("setting-name");
    settingName.textContent = setting.option;
    settingBox.append(settingName);

    const settingSelectList = document.createElement("div");
    settingSelectList.classList.add("setting-select-list");
    settingBox.append(settingSelectList);

    if (setting.option == "Theme") {
        for (let j = 0; j < setting.themes.length; j++) {
            const themeName = setting.themes[j];

            const themeButton = document.createElement("button");
            themeButton.classList.add("theme-button", "setting-option-button", themeName + "-btn");
            themeButton.dataset.theme = themeName;
            themeButton.addEventListener("click", () => { setTheme(themeName) });
            settingSelectList.append(themeButton);
        }

        setTheme(getData("Theme") || "dark-blue");
    }
    else if (setting.option == "Font Size") {
        const fontSizeNumber = document.createElement("h3");
        fontSizeNumber.classList.add("font-size-number");
        fontSizeNumber.textContent = getData("Font Size") | "1.0";

        const decreaseFontSizeBtn = document.createElement("button");
        decreaseFontSizeBtn.classList.add("font-size-button");
        decreaseFontSizeBtn.textContent = "–";
        decreaseFontSizeBtn.addEventListener("click", () => { adjustFontSize(fontSizeNumber, "decrease") });

        const increaseFontSizeBtn = document.createElement("button");
        increaseFontSizeBtn.classList.add("font-size-button");
        increaseFontSizeBtn.textContent = "+";
        increaseFontSizeBtn.addEventListener("click", () => { adjustFontSize(fontSizeNumber, "increase") });

        settingSelectList.append(decreaseFontSizeBtn);
        settingSelectList.append(fontSizeNumber);
        settingSelectList.append(increaseFontSizeBtn);

        adjustFontSize(fontSizeNumber);
    }
    else if (setting.option == "Languages") {
        for (let j = 0; j < setting.languages.length; j++) {
            const languageName = setting.languages[j];

            const languageButton = document.createElement("button");
            languageButton.classList.add("language-button", "setting-option-button");
            languageButton.dataset.language = languageName;
            languageButton.textContent = languageName.slice(0, 2);
            languageButton.addEventListener("click", () => { setLanguage(languageName, languageButton) });
            settingSelectList.append(languageButton);
        }

        const currentLanguages = getData("Language") || ["arabic", "english"];

        currentLanguages.map(lang => {
            document.querySelector(`[data-language=${lang}]`).classList.add("selected");
        });
    }
}

function setTheme(themeName) {
    document.body.classList = "";

    saveData("Theme", themeName);

    if (themeName != "dark-blue") {
        document.body.classList.add(themeName);
    }

    Array.from(document.querySelectorAll(".theme-button")).map(el => {
        if (el.dataset.theme == themeName) {
            el.classList.add("selected");
        }
        else {
            el.classList.remove("selected");
        }
    });

    mobileThemeColor();
}

function adjustFontSize(ui, dir) {
    let fontSize = getData("Font Size") || 1;

    if (dir == "decrease") {
        fontSize = Math.max(0.5, fontSize - 0.1);
    }
    else if (dir == "increase") {
        fontSize = Math.min(2.5, fontSize + 0.1);
    }

    ui.textContent = fontSize.toFixed(1);

    document.documentElement.style.setProperty("--font-size", fontSize);

    saveData("Font Size", fontSize);
}

function setLanguage(languageName, languageButton) {
    const currentLanguages = getData("Language");

    if (!currentLanguages.includes(languageName)) {
        currentLanguages.push(languageName);
        languageButton.classList.add("selected");
    }
    else {
        if (currentLanguages.length == 1) return;

        const index = currentLanguages.indexOf(languageName);
        currentLanguages.splice(index, 1);
        languageButton.classList.remove("selected");
    }

    saveData("Language", currentLanguages);

    toggleLanguages();
}

/*
function toggleHideElements() {
    goHomeBtn.classList.toggle("hidden");
    goUpBtn.classList.toggle("hidden");
    headerTitleWrapper.classList.toggle("hidden");
}*/