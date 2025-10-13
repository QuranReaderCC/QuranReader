import { quran } from "./quran.js";

export function getData(name) {
    return JSON.parse(localStorage.getItem(name));
}

export function saveData(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

export function buttonMenuToggle(menu) {
    menu.classList.toggle("hidden");
}

export function toggleLanguages() {
    const currentLanguages = getData("Language");
    const verseTexts = document.querySelectorAll(".verse-text");
    const verseTextsLength = verseTexts.length;

    for (let i = 0; i < verseTextsLength; i++) {
        const verseText = verseTexts[i];

        if (currentLanguages.includes(verseText.dataset.language)) {
            verseText.classList.remove("hidden");
        }
        else {
            verseText.classList.add("hidden");
        }
    }
}

export function isQueryValid(query, searchBar) {
    let isError = false;

    const splitQuery = query.replaceAll(" ", "").split(",");

    for (let i = 0; i < splitQuery.length; i++) {
        let el = splitQuery[i];

        if (el.match(/^\d+$/)) {
            if (!quran[el]) {
                isError = true;
                break;
            }
        }
        else if (el.match(/^\d+:\d+$/)) {
            el = el.split(":");

            if (!quran[el[0]] || !quran[el[0]].verses[el[1]]) {
                isError = true;
                break;
            }
        }
        else if (el.match(/^\d+:\d+-\d+$/)) {
            el = el.split(/[:\-]/);

            if (!quran[el[0]] || !quran[el[0]].verses[el[1]] || !quran[el[0]].verses[el[2]]) {
                isError = true;
                break;
            }
        }
        else {
            isError = true;
            break;
        }
    }

    if (isError) {
        searchBar.classList.add("error-shake");
        searchBar.addEventListener("animationend", () => {
            searchBar.classList.remove("error-shake");
        });
        return false;
    }

    return true;
}

export function arabicNumber(number) {
    return number.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}

export function mobileThemeColor() {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const themeColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--base-color')
        .trim();

    themeColorMeta.setAttribute('content', themeColor);
}