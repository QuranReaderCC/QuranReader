import { quran } from "./quran.js";
import { getData, arabicNumber } from "./helpers.js";

export function copyVerses(refs) {
    // total surah boxes
    if (refs.length == 1) {
        // total verses in surah box
        if (refs[0].length == 1) {
            copy(singleCopyContent(refs[0][0]));
        }
        else {
            copy(multiSameCopyContent(refs[0]));
        }
    }
    else {
        let content = "";

        for (let i = 0; i < refs.length; i++) {
            content += multiSameCopyContent(refs[i]);
            
            if (i != refs.length - 1) {
                content += "\n\n-----\n\n";
            }
        }

        copy(content);
    }
}

function singleCopyContent(verse) {
    let content = "";

    const langs = getData("Language");

    const arabicName = quran[verse.surahNumber].name.arabic;
    const transliteratedName = quran[verse.surahNumber].name.transliterated;
    
    if (langs.includes("arabic")) content += verse.arabic + "\n\n";
    if (langs.includes("english")) content += verse.english + "\n\n";

    if (langs.includes("arabic") && !langs.includes("english")) {
        content += `(${arabicName} ${arabicNumber(verse.surahNumber)}:${arabicNumber(verse.number)})`
    }
    else {
        content += `(${transliteratedName} ${verse.surahNumber}:${verse.number})`;
    }

    return content.trim();
}

function multiSameCopyContent(verses) {
    let content = "";

    const langs = getData("Language");

    const arabicName = quran[verses[0].surahNumber].name.arabic;
    const transliteratedName = quran[verses[0].surahNumber].name.transliterated;

    if (langs.includes("arabic") && !langs.includes("english")) {
        content += `(${arabicNumber(verses[0].surahNumber)}: ${arabicName})\n\n`;
    }
    else {
        content += `(${verses[0].surahNumber}: ${transliteratedName})\n\n`;
    }

    if (langs.includes("arabic")) {
        for (let i = 0; i < verses.length; i++) {
            const verse = verses[i];
            content += `${arabicNumber(verse.number)}: ${verse.arabic}\n\n`;
        }
    }

    if (langs.includes("english")) {
        for (let i = 0; i < verses.length; i++) {
            const verse = verses[i];
            content += `${verse.number}: ${verse.english}\n\n`;
        }
    }

    return content.trim();
}

export function copyLink(verse) {
    const url = `http://localhost:3000/read?${verse.surahNumber}:${verse.number}`;
    copy(url);
}

function copy(content) {
    navigator.clipboard.writeText(content);
}