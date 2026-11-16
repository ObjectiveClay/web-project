const THEMES = ["light", "dark"];


function getSavedTheme() {
    const theme = themeStorage.get();
    return THEMES.includes(theme) ? theme : "light";
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeStorage.save(theme);
}

function getThemeButtonText(theme) {
    return theme === "dark" ? "☀ Light" : "☾ Dark";
}

function createThemeButton() {
    const nav = document.querySelector("nav");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "theme-toggle";
    button.textContent = getThemeButtonText(getSavedTheme());

    button.addEventListener("click", () => {
        const newTheme = getSavedTheme() === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        button.textContent = getThemeButtonText(newTheme);
    });

    nav.appendChild(button);
}

function getFavorites() {
    return favoritesStorage.get()
        .map(Number)
        .filter((id) => findHotelById(id) !== null);
}

function isFavorite(id) {
    return getFavorites().includes(Number(id));
}

function toggleFavorite(id) {
    const targetId = Number(id);
    const favorites = getFavorites();
    const index = favorites.indexOf(targetId);

    if (index === -1) {
        favorites.push(targetId);
    } else {
        favorites.splice(index, 1);
    }

    favoritesStorage.save(favorites);
}

function updateFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach((button) => {
        const saved = isFavorite(button.dataset.id);
        const hotel = findHotelById(button.dataset.id);
        const action = saved ? "Remove from favorites" : "Add to favorites";

        button.textContent = saved ? "♥" : "♡";
        button.classList.toggle("is-favorite", saved);
        button.setAttribute("aria-pressed", saved);

        if (hotel) {
            button.setAttribute("aria-label", `${action}: ${hotel.name}`);
        }
    });
}

function createFavoriteItem(hotel) {
    const item = document.createElement("li");
    item.innerHTML = `
        <a href="${hotel.getDetailsUrl()}">${hotel.name}</a>
        <button class="favorite-remove" type="button" data-id="${hotel.id}"
            aria-label="Remove ${hotel.name} from favorites">✕</button>`;
    return item;
}

function renderFavoritesPanel() {
    const panel = document.getElementById("favorites-panel");
    if (!panel) {
        return;
    }

    const favorites = getFavorites();
    panel.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = `Favorites (${favorites.length})`;
    panel.appendChild(title);

    if (favorites.length === 0) {
        const message = document.createElement("p");
        message.className = "muted";
        message.textContent = "Press ♡ on a hotel to save it here.";
        panel.appendChild(message);
        return;
    }

    const list = document.createElement("ul");
    list.className = "favorites-list";

    for (const id of favorites) {
        list.appendChild(createFavoriteItem(findHotelById(id)));
    }

    panel.appendChild(list);
}

function handleFavoriteClick(event) {
    const button = event.target.closest(".favorite-btn, .favorite-remove");
    if (!button) {
        return;
    }

    toggleFavorite(button.dataset.id);
    updateFavoriteButtons();
    renderFavoritesPanel();
}

applyTheme(getSavedTheme());

document.addEventListener("DOMContentLoaded", () => {
    createThemeButton();
    renderFavoritesPanel();
    document.addEventListener("click", handleFavoriteClick);
});