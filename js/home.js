
function getPopularHotels(limit) {
    const popularHotels = [];
    for (let i = 0; i < hotels.length && popularHotels.length < limit; i++) {
        if (hotels[i].popular) {
            popularHotels.push(hotels[i]);
        }
    }
    return popularHotels;
}

function handleHomeSearch(event) {
    event.preventDefault();

    const city = document.getElementById("home-destination").value.trim();
    let url = "hotels.html";
    if (city !== "") {
        url += `?city=${encodeURIComponent(city)}`;
    }
    window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
    const popularContainer = document.getElementById("popular-hotels");
    renderHotels(getPopularHotels(3), popularContainer, "card");

    document.getElementById("home-search").addEventListener("submit", handleHomeSearch);
});