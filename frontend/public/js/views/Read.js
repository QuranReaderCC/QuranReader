import AbstractView from "./AbstractView.js";
import { quran } from "../quran.js";
import { getData, toggleLanguages } from "../helpers.js";
import { copy, copyVerses, copyLink } from "../copy.js";

const searchBar = document.querySelector(".search-bar");

const copyAllBtn = document.querySelector(".copy-all-btn");
const linkBtn = document.querySelector(".link-btn");

let copyAllContent = null;
let linkContent = null;

copyAllBtn.addEventListener("click", () => {
    copyVerses(copyAllContent);
    copyAllBtn.classList.add("copy-flash");
});
copyAllBtn.addEventListener("animationend", () => {
    copyAllBtn.classList.remove("copy-flash");
});

linkBtn.addEventListener("click", () => {
    copy(window.location.href);
    linkBtn.classList.add("copy-flash");
});
linkBtn.addEventListener("animationend", () => {
    linkBtn.classList.remove("copy-flash");
});

const scrollToOffset = 270;


export default class extends AbstractView {
    constructor() {
        super();
    }

    async getView(main, query) {
        document.querySelector(".go-home-btn").classList.remove("invisible");

        const { queryDisplay, queryObj } = this.displayQuery(query);
        if (!queryDisplay) return;
        main.append(queryDisplay);
        toggleLanguages();

        const scrollToRef = queryDisplay.querySelector("[data-ref]");

        if (scrollToRef) {
            copyAllContent = [[...Object.values(queryObj[0].verses)]];

            const refPos = scrollToRef.getBoundingClientRect().top + window.scrollY - scrollToOffset;

            window.scrollTo({ top: refPos, behavior: "smooth" });
        }
        else {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }

    setTitle(title) {
        document.title = title + " | QuranReader";
    }

    getQueryResults(query) {
        let isError = false;

        const queryObj = [];

        const splitQuery = query.replaceAll(" ", "").split(",");

        for (let i = 0; i < splitQuery.length; i++) {
            let el = splitQuery[i];

            if (el.match(/^\d+$/)) {
                if (quran[el]) {
                    queryObj.push({
                        name: quran[el].name,
                        number: quran[el].number,
                        verses: quran[el].verses
                    });

                    this.setTitle(`${quran[el].name.transliterated} (${quran[el].number})`);
                }
                else {
                    isError = true;
                    break;
                }
            }
            else if (el.match(/^\d+:\d+$/)) {
                el = el.split(":");

                if (quran[el[0]] && quran[el[0]].verses[el[1]]) {

                    queryObj.push({
                        name: quran[el[0]].name,
                        number: el[0],
                        verses: { [el[1]]: quran[el[0]].verses[el[1]] }
                    });

                    this.setTitle(quran[el[0]].name.transliterated);
                }
                else {
                    isError = true;
                    break;
                }
            }
            else if (el.match(/^\d+:\d+-\d+$/)) {
                el = el.split(/[:\-]/);

                if (quran[el[0]] && quran[el[0]].verses[el[1]] && quran[el[0]].verses[el[2]]) {
                    const verses = {};

                    for (let i = el[1]; i <= parseInt(el[2]); i++) {
                        verses[i] = quran[el[0]].verses[i];
                    }

                    queryObj.push({
                        name: quran[el[0]].name,
                        number: quran[el[0]].number,
                        verses: verses
                    });
                }
                else {
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
            return "error";
        }

        return queryObj;
    }

    displayQuery(query) {
        const queryObj = this.getQueryResults(query);

        if (queryObj == "error") return;

        const surahDisplay = document.createElement("div");
        surahDisplay.classList.add("surah-display");

        for (let i = 0; i < queryObj.length; i++) {
            let surah = queryObj[i];

            let startVerseNumber;
            let verseNumberCount;

            const surahBox = document.createElement("div");
            surahBox.classList.add("surah-box", "center");
            surahDisplay.append(surahBox);

            const surahNameWrapper = document.createElement("div");
            surahNameWrapper.classList.add("surah-name-wrapper");
            surahBox.append(surahNameWrapper);

            const verseCopyWrapper = document.createElement("div");
            surahNameWrapper.append(verseCopyWrapper);

            const verseCopy = document.createElement("button");
            verseCopy.classList.add("verse-copy");
            verseCopy.addEventListener("click", () => {
                copyVerses([[...Object.values(surah.verses)]]);
                verseCopy.classList.add("copy-flash");
            });
            verseCopy.addEventListener("animationend", () => {
                verseCopy.classList.remove("copy-flash");
            });
            verseCopyWrapper.append(verseCopy);

            const verseCopyIcon = document.createElement("i");
            verseCopyIcon.classList.add("fa-solid", "fa-copy");
            verseCopy.append(verseCopyIcon);

            const surahName = document.createElement("h1");
            surahName.classList.add("surah-name");
            surahName.innerHTML = `${surah.number} <span style="font-size:0.8em">${surah.name.transliterated}</span>`;
            surahNameWrapper.append(surahName);

            if (queryObj.length == 1) {
                if (surah.number != 1 && surah.number != 9) {
                    const basmalah = document.createElement("div");
                    basmalah.classList.add("basmalah");
                    basmalah.innerHTML = `
                <span>بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</span>
                <br>
                <span>In the name of God, the Most Gracious, the Most Merciful</span>`;
                    surahBox.append(basmalah);
                }

                startVerseNumber = parseInt(Object.keys(queryObj[0].verses)[0]);
                verseNumberCount = Object.values(queryObj[0].verses).length;

                surah = quran[surah.number];
            }

            for (let j = 0; j < Object.keys(surah.verses).length; j++) {
                const verse = Object.values(surah.verses)[j];

                const verseBody = document.createElement("div");
                verseBody.classList.add("verse-body");
                verseBody.dataset.verseRef = surah.number + ":" + verse.number;
                surahBox.append(verseBody);

                const verseSidebar = document.createElement("div");
                verseSidebar.classList.add("verse-sidebar");
                verseBody.append(verseSidebar);

                const spacer = document.createElement("div");
                verseSidebar.append(spacer);

                const verseNumber = document.createElement("div");
                verseNumber.classList.add("verse-number");
                verseNumber.textContent = verse.surahNumber + ":" + verse.number;
                verseSidebar.append(verseNumber);

                const verseCopyWrapper = document.createElement("div");
                verseCopyWrapper.classList.add("verse-copy-wrapper");
                verseSidebar.append(verseCopyWrapper);

                //

                const verseCopy = document.createElement("button");
                verseCopy.classList.add("verse-copy");
                verseCopy.addEventListener("click", () => {
                    copyVerses([[verse]]);
                    verseCopy.classList.add("copy-flash");
                });
                verseCopy.addEventListener("animationend", () => {
                    verseCopy.classList.remove("copy-flash");
                });
                verseCopyWrapper.append(verseCopy);

                const verseCopyIcon = document.createElement("i");
                verseCopyIcon.classList.add("fa-solid", "fa-copy");
                verseCopy.append(verseCopyIcon);

                //

                const verseLinkCopy = document.createElement("button");
                verseLinkCopy.classList.add("verse-copy");
                verseLinkCopy.addEventListener("click", () => {
                    copyLink(verse);
                    verseLinkCopy.classList.add("copy-flash");
                });
                verseLinkCopy.addEventListener("animationend", () => {
                    verseLinkCopy.classList.remove("copy-flash");
                });
                verseCopyWrapper.append(verseLinkCopy);

                const verseLinkCopyIcon = document.createElement("i");
                verseLinkCopyIcon.classList.add("fa-solid", "fa-link");
                verseLinkCopy.append(verseLinkCopyIcon);

                //

                const verseDiv = document.createElement("div");
                verseDiv.classList.add("verse-div");
                surahBox.append(verseDiv);
                verseBody.append(verseDiv);

                const verseRight = document.createElement("div");
                verseRight.classList.add("verse-right");
                verseBody.append(verseRight);

                const ara = verse.arabic;
                const araText = document.createElement("p");
                araText.classList.add("ara-text", "verse-text");
                araText.dataset.language = "arabic";
                araText.textContent = ara;
                verseDiv.append(araText);

                const eng = verse.english;
                const engText = document.createElement("p");
                engText.classList.add("eng-text", "verse-text");
                engText.dataset.language = "english";
                engText.textContent = eng;
                verseDiv.append(engText);

                if (verseNumberCount < surah.verseCount
                    && j + 1 >= startVerseNumber
                    && j + 1 < startVerseNumber + verseNumberCount) {

                    verseBody.setAttribute("data-ref", "");
                    verseBody.classList.add("highlight");
                }
            }
        }

        if (queryObj.length > 0) {
            const asArrays = queryObj.map(item => Object.values(item.verses));
            copyAllContent = asArrays;
        }

        return { queryDisplay: surahDisplay, queryObj: queryObj };
    }
}