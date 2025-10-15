import Home from "./views/Home.js";
import Read from "./views/Read.js";

import { getData, saveData, isQueryValid } from "./helpers.js";

const wrapper = document.querySelector(".wrapper");
const main = document.querySelector("main");
const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const headerTempMenu = document.querySelector(".header-temp-menu");
const goUpBtn = document.querySelector(".go-up-btn");

const searchBarWrapper = document.querySelector(".search-bar-wrapper");
const searchResultsMenuWrapper = document.querySelector(".search-results-menu-wrapper");

const backdrop = document.querySelector(".backdrop");

const settingsWrapper = document.querySelector(".settings-wrapper");
const settingsMenuWrapper = document.querySelector(".settings-menu-wrapper");

const keyboard = document.querySelector(".keyboard");

if (!getData("Language")) {
    saveData("Language", ["arabic", "english"]);
}

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: Home },
        { path: "/read", view: Read }
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    }

    const query = location.search.substring(1);
    const view = new match.route.view(query);

    main.innerHTML = "";
    headerTempMenu.innerHTML = "";
    await view.getView(main, query);
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    document.querySelector(".search-bar").addEventListener('keydown', e => {
        if (e.key === "Enter" && isQueryValid(e.target.value, e.target)) {
            e.preventDefault();
            navigateTo(`/read?${e.target.value.replaceAll(" ", "")}`);
            keyboard.classList.add("hidden");
            searchResultsMenuWrapper.classList.add("hidden");
            backdrop.classList.add("hidden");
        }
    });

    router();
});

window.onscroll = function () {
    scrollFunction();

    if (checkIfHome()) saveData("HSP", window.scrollY);
};

function scrollFunction() {
    if (wrapper.classList.contains("wrapper-hidden")) {
        if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
            header.classList.add("hidden");
        }
        else {
            header.classList.remove("hidden");
        }
    }

    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
        header.classList.add("scroll");
        goUpBtn.classList.remove("invisible");
    } else {
        header.classList.remove("scroll");
        goUpBtn.classList.add("invisible");
    }
}

document.addEventListener("click", (event) => {
    const clickedOutsideSearchBar = !searchBarWrapper.contains(event.target) || event.target.classList.contains("search-result");
    const clickedOutsideKeyboard = !keyboard.contains(event.target);

    if (clickedOutsideSearchBar && clickedOutsideKeyboard) {
        searchResultsMenuWrapper.classList.add("hidden");
        keyboard.classList.add("hidden");
        backdrop.classList.add("hidden");
    } else {
        searchResultsMenuWrapper.classList.remove("hidden");
        keyboard.classList.remove("hidden");
        backdrop.classList.remove("hidden");
    }

    if (!settingsWrapper.contains(event.target)) {
        settingsMenuWrapper.classList.add("hidden");
    }
});

let touchStartY = 0;
let touchStartX = 0;

document.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaY = Math.abs(touch.clientY - touchStartY);
    const deltaX = Math.abs(touch.clientX - touchStartX);

    const isTap = deltaY < 10 && deltaX < 10;

    const isButton = event.target.tagName == "BUTTON";

    if (isTap && !isButton) {
        if (!document.querySelector(".surah-display")) return;

        if (!header.contains(event.target)
            && !menu.contains(event.target)) {
            menu.classList.toggle("hidden");
            wrapper.classList.toggle("wrapper-hidden");

            if ((document.body.scrollTop > 40 || document.documentElement.scrollTop > 40)
                && menu.classList.contains("hidden")) {
                header.classList.add("hidden");
            }
            else {
                header.classList.remove("hidden");
            }
        }
    }
}, { passive: true });

goUpBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    header.classList.remove("hidden");
    menu.classList.remove("hidden");
    wrapper.classList.remove("wrapper-hidden");

});

function checkIfHome() {
    const url = new URL(window.location.href);
    return url.pathname === "" || url.pathname === "/";
}