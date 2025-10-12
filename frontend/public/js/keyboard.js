const searchBar = document.querySelector(".search-bar");
const keyboard = document.querySelector(".keyboard");
const letters = document.querySelector(".letters");

const keys = "ضصثقفغعهخحجشسيبلاتنمكةءظطذدزروىأإآئؤ".split("");


function createKeys() {
    for (let i = 0; i < keys.length; i++) {
        const keyContent = keys[i];
        const keyBtn = document.createElement("button");
        keyBtn.classList.add("key-btn", "btn");
        letters.append(keyBtn);
        keyBtn.textContent = keyContent;
        keyBtn.addEventListener("click", () => { writeToSearchBar(keyContent) } );
    }
}

createKeys();

const deleteCharBtn = document.querySelector(".delete-char-btn");

deleteCharBtn.addEventListener("click", deleteLastCharacter);

function deleteLastCharacter() {
    searchBar.value = searchBar.value.slice(0, -1);
    searchBar.dispatchEvent(new Event("input", { bubbles: true }));
}

const spaceBar = document.querySelector(".space-bar");

spaceBar.addEventListener("click", () => { writeToSearchBar(" ") });

function writeToSearchBar(keyContent) {
    searchBar.value += keyContent;
    searchBar.dispatchEvent(new Event("input", { bubbles: true }));
}