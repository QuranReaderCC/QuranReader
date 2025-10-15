import AbstractView from "./AbstractView.js";

import { chNames, namesLength } from "../quran.js";
import { getData } from "../helpers.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getView(main) {
        document.querySelector(".go-home-btn").classList.add("invisible");

        const surahListWrapper = document.createElement("div");
        surahListWrapper.classList.add("surah-list-wrapper");

        const surahList = document.createElement("div");
        surahList.classList.add("surah-list");
        surahListWrapper.append(surahList);

        for (let i = 0; i < namesLength; i++) {
            surahList.append(createOptionBox(chNames[i + 1]));
        }

        main.append(surahListWrapper);

        const scrollPos = getData("HSP") || 0;
        window.scrollTo({ top: scrollPos, behavior: "instant" });
    }
}

function createOptionBox(data) {
    const optionBox = document.createElement("a");
    optionBox.classList.add("option-box");
    optionBox.href = `/read?${data.number}`;
    optionBox.setAttribute("data-link", "");

    const numberText = document.createElement("h2");
    numberText.textContent = data.number;
    optionBox.append(numberText);

    const arabicNameWrapper = document.createElement("div");
    arabicNameWrapper.classList.add("arabic-name-wrapper");
    optionBox.append(arabicNameWrapper);

    const arabicName = document.createElement("img");
    arabicName.classList.add("arabic-name");
    arabicName.src = `images/surah_images/surah_${data.number}.png`;
    arabicNameWrapper.append(arabicName);

    const transliteratedName = document.createElement("h2");
    transliteratedName.textContent = data.name.transliterated;
    optionBox.append(transliteratedName);

    const englishName = document.createElement("p");
    englishName.textContent = data.name.english;
    optionBox.append(englishName);

    return optionBox;
}