
const MAX_RECENT_HOTELS = 3;

function getRecentHotels() {
    return recentStorage.get()
        .map((id) => findHotelById(id))
        .filter((hotel) => hotel !== null);
}

function addToRecent(hotelId) {
    const id = Number(hotelId);
    const recentIds = recentStorage.get()
        .map(Number)
        .filter((savedId) => savedId !== id);

    recentIds.unshift(id);
    recentStorage.save(recentIds.slice(0, MAX_RECENT_HOTELS));
}

function renderRecentSection() {
    const section = document.getElementById("recent-section");
    if (!section) {
        return;
    }

    const recentHotels = getRecentHotels();
    section.classList.toggle("hidden", recentHotels.length === 0);
    renderHotels(recentHotels, document.getElementById("recent-hotels"), "card");
}

function clearRecent() {
    recentStorage.clear();
    renderRecentSection();
}

document.addEventListener("DOMContentLoaded", () => {
    renderRecentSection();

    const clearButton = document.getElementById("clear-recent");
    if (clearButton) {
        clearButton.addEventListener("click", clearRecent);
    }
});