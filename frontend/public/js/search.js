import { quran } from './quran.js';

const searchBar = document.querySelector(".search-bar");
const searchResultsMenuWrapper = document.querySelector(".search-results-menu-wrapper");
const searchResultsMenu = document.querySelector(".search-results-menu");
const pageSelector = document.querySelector(".page-selector");
const resultCount = document.querySelector(".result-count");
const keyboard = document.querySelector(".keyboard");
const backdrop = document.querySelector(".backdrop");
const removeSearchBtn = document.querySelector(".remove-search-btn");

searchBar.addEventListener("focus", (e) => {
    displaySearchResults(searchBar.value);
    keyboard.classList.remove("hidden");
    searchResultsMenuWrapper.classList.remove("hidden");
    backdrop.classList.remove("hidden");
});

searchBar.addEventListener("input", (e) => {
    displaySearchResults(searchBar.value);

    if (searchBar.value.length > 0) removeSearchBtn.classList.remove("hidden");
    else removeSearchBtn.classList.add("hidden");
});

function displaySearchResults(query) {
    resetSearch();

    let maxOnPage = 10;

    const results = [];

    query = query.toLowerCase();
    query = plainArabic(query);

    if (query.length == 0) {
        maxOnPage = 7;
        for (let i = 0; i < 114; i++) {
            const surah = Object.values(quran)[i];
            results.push(searchResult(surah, "surah"));
        }
    }
    else if (query.match(/^\D+$/)) {
        for (let i = 0; i < 114; i++) {
            const surah = Object.values(quran)[i];

            if (surah.name.english.toLowerCase().includes(query) ||
                plainArabic(surah.name.arabic).includes(query) ||
                surah.name.transliterated.toLowerCase().includes(query)) {
                results.push(searchResult(surah, "surah", query));
            }
        }

        for (let i = 0; i < 114; i++) {
            const surah = Object.values(quran)[i];
            const verses = surah.verses;

            if (query.length <= 2) continue;

            for (let j = 0; j < surah.verseCount; j++) {
                const verse = Object.values(verses)[j];

                const cleanEnglish = verse.english.replace(/\[[^\]]*\]/g, '').toLowerCase();

                if (cleanEnglish.includes(query) ||
                    plainArabic(verse.arabic).includes(query)) {
                    results.push(searchResult(verse, "verse", query));
                }
            }
        }
    }
    else if (query.match(/^\d+$/)) {
        const surah = quran[query];

        if (surah) {
            results.push(searchResult(surah, "surah", query));
        }
    }
    else if (query.match(/^\d+:$/)) {
        query = query.split(":");

        const surah = quran[query[0]];

        if (surah) {
            results.push(searchResult(surah, "surah", query));
        }

        /*const verses = Object.values(surah.verses);
        const versesLength = verses.length;

        for (let i = 0; i < versesLength; i++) {
            const verse = verses[i];
            results.push(searchResult(verse, "verse", ""));
        }*/
    }
    else if (query.match(/^\d+:\d+$/)) {
        query = query.split(":");

        const surah = quran[query[0]];
        const verse = surah.verses[query[1]];

        if (quran[query[0]] && quran[query[0]].verses[query[1]]) {
            results.push(searchResult(verse, "verse", ""));
        }
    }

    const resultsLength = results.length;
    const resultPagesLength = resultsLength / maxOnPage;
    const resultPages = [];

    resultCount.innerHTML = resultsLength == 1 ? resultsLength + " result" : resultsLength + " results";

    for (let i = 0; i < resultPagesLength; i++) {
        const resultPage = document.createElement("div");
        resultPage.classList.add("result-page");
        searchResultsMenu.append(resultPage);
        resultPages.push(resultPage);


        const pageNumber = document.createElement("button");
        pageNumber.classList.add("page-number");
        pageNumber.textContent = i + 1;
        pageSelector.append(pageNumber);

        if (i > 0) resultPage.classList.add("hidden");
        else pageNumber.classList.add("current");

        pageNumber.addEventListener("click", () => {
            const currentPageNumber = pageSelector.querySelector(".current");
            currentPageNumber.classList.remove("current");

            const pageNumbers = Array.from(pageSelector.querySelectorAll(".page-number"));
            const index = pageNumbers.indexOf(currentPageNumber);
            searchResultsMenu.children[index].classList.add("hidden");

            resultPage.classList.remove("hidden");
            pageNumber.classList.add("current");
        });

        const startPoint = i * maxOnPage;

        for (let j = 0; j < maxOnPage; j++) {
            const index = startPoint + j;

            if (!results[index]) break;

            resultPage.append(results[index]);
        }
    }
}

function searchResult(data, type, query = null) {
    const searchResult = document.createElement("a");
    searchResult.classList.add("search-result");
    searchResult.tabIndex = 0;

    let verseReference;

    if (type == "surah") {
        let text = `${data.number}: ${data.name.transliterated} | ${data.name.english} | ${data.name.arabic}`;
        text = highlightMatch(text, query);

        searchResult.innerHTML = `
        <div class="result-label">${text}</div>
        `

        verseReference = data.number.toString();
    }
    else if (type == "verse") {
        let label = `(${quran[data.surahNumber].name.transliterated} / ${data.surahNumber}:${data.number})`;
        let text = `${data.arabic}\n${data.english}`;
        text = highlightMatch(text, query);
        text = text.split("\n");

        searchResult.innerHTML = `
        <div class="result-label">${label}</div>
        <div class="result-ara-text">${text[0]}</div>
        <div class="result-eng-text">${text[1]}</div>
        `

        verseReference = data.surahNumber + ":" + data.number
    }

    searchResult.href = `/read?${verseReference}`;
    searchResult.setAttribute("data-link", "");

    searchResult.addEventListener('click', function (e) {
        searchResultsMenuWrapper.classList.add("hidden");
        keyboard.classList.add("hidden");
        backdrop.classList.add("hidden");
    });

    return searchResult;
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(?!\\d)(${query})(?!\\d)`, 'ig');
    return text.replace(regex, '<b>$1</b>');
}

function resetSearch() {
    searchResultsMenu.innerHTML = "";
    pageSelector.innerHTML = "";
}

function plainArabic(text) {
    let arabicDiacritics = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
    text = text.replace(arabicDiacritics, '');
    text = text.replaceAll("ـ", "");
    text = text.replaceAll(" ٰ", "ا");
    return text;
}

removeSearchBtn.addEventListener("click", () => {
    searchBar.value = "";
    searchBar.dispatchEvent(new Event("input", { bubbles: true }));
});