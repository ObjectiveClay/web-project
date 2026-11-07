const hotelList = document.getElementById("hotel-list");
const filterForm = document.getElementById("filter-form");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const resultsCount = document.getElementById("results-count");
const resetButton = document.getElementById("reset-filters");

function renderAmenityFilters() {
    const container = document.getElementById("amenity-filters");

    amenities.forEach((amenity) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "amenity";
        checkbox.value = amenity.id;

        label.appendChild(checkbox);
        label.append(` ${amenity.label}`);
        container.appendChild(label);
    });
}

function getCheckedValues(groupName) {
    const checkedInputs = document.querySelectorAll(`input[name="${groupName}"]:checked`);
    const values = [];
    checkedInputs.forEach((input) => {
        values.push(input.value);
    });
    return values;
}

function matchesSearch(hotel, query) {
    if (query === "") {
        return true;
    }
    const searchableText = `${hotel.name} ${hotel.city} ${hotel.country}`.toLowerCase();
    return searchableText.includes(query.toLowerCase());
}

function matchesPrice(hotel, ranges) {
    if (ranges.length === 0) {
        return true;
    }
    for (const range of ranges) {
        const [min, max] = range.split("-").map(Number);
        if (hotel.price >= min && hotel.price < max) {
            return true;
        }
    }
    return false;
}

function matchesRating(hotel, ratings) {
    if (ratings.length === 0) {
        return true;
    }
    return hotel.stars >= Math.min(...ratings.map(Number));
}

function matchesAmenities(hotel, selectedAmenities) {
    return selectedAmenities.every((id) => hotel.amenities.includes(id));
}

function sortHotels(hotelsToSort, sortMode) {
    const sortedHotels = [...hotelsToSort];

    if (sortMode === "price-asc") {
        sortedHotels.sort((a, b) => a.price - b.price);
    } else if (sortMode === "price-desc") {
        sortedHotels.sort((a, b) => b.price - a.price);
    } else if (sortMode === "rating-desc") {
        sortedHotels.sort((a, b) => b.rating - a.rating);
    }

    return sortedHotels;
}

function updateResultsCount(count) {
    const word = count === 1 ? "hotel" : "hotels";
    resultsCount.textContent = `Showing ${count} ${word}`;
}

function removeEmptyMessage() {
    const message = document.getElementById("empty-message");
    if (message) {
        message.remove();
    }
}

function showEmptyMessage() {
    removeEmptyMessage();

    const message = document.createElement("p");
    message.id = "empty-message";
    message.className = "empty-message";
    message.textContent = "No hotels match your filters. Try changing them.";
    hotelList.after(message);
}

function hasActiveFilters() {
    return searchInput.value.trim() !== "" ||
        filterForm.querySelectorAll("input:checked").length > 0;
}

function applyFilters() {
    const query = searchInput.value.trim();
    const priceRanges = getCheckedValues("price");
    const ratings = getCheckedValues("rating");
    const selectedAmenities = getCheckedValues("amenity");

    const filteredHotels = hotels.filter((hotel) => {
        return matchesSearch(hotel, query) &&
            matchesPrice(hotel, priceRanges) &&
            matchesRating(hotel, ratings) &&
            matchesAmenities(hotel, selectedAmenities);
    });

    const sortedHotels = sortHotels(filteredHotels, sortSelect.value);

    renderHotels(sortedHotels, hotelList, "row");
    updateResultsCount(sortedHotels.length);

    if (sortedHotels.length === 0) {
        showEmptyMessage();
    } else {
        removeEmptyMessage();
    }

    resetButton.classList.toggle("hidden", !hasActiveFilters());
}

function handleFilterChange(event) {
    if (event.target.type === "checkbox") {
        const label = event.target.closest("label");
        label.classList.toggle("filter-active", event.target.checked);
    }
    applyFilters();
}

function resetFilters() {
    filterForm.reset();
    filterForm.querySelectorAll(".filter-active").forEach((label) => {
        label.classList.remove("filter-active");
    });
    applyFilters();
}

document.addEventListener("DOMContentLoaded", () => {
    renderAmenityFilters();

    const city = getQueryParam("city");
    if (city) {
        searchInput.value = city;
    }

    searchInput.addEventListener("input", applyFilters);
    filterForm.addEventListener("change", handleFilterChange);
    sortSelect.addEventListener("change", applyFilters);
    resetButton.addEventListener("click", resetFilters);

    filterForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });

    applyFilters();
});