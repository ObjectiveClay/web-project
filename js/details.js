
function getCurrentHotel() {
    const id = getQueryParam("id");
    if (id === null) {
        return hotels[0];
    }
    return findHotelById(id);
}

function getAmenityLabel(amenityId) {
    for (const amenity of amenities) {
        if (amenity.id === amenityId) {
            return amenity.label;
        }
    }
    return amenityId;
}

function getHotelReviews(hotel) {
    const hotelReviews = [];
    for (let i = 0; i < 3; i++) {
        const index = (hotel.id + i) % sampleReviews.length;
        hotelReviews.push(sampleReviews[index]);
    }
    return hotelReviews;
}

function renderHotelHeader(hotel) {
    document.title = `HotelBook — ${hotel.name}`;
    document.getElementById("hotel-name").textContent = hotel.name;
    document.getElementById("hotel-rating").textContent =
        `${hotel.getStars()} ${hotel.rating} (${hotel.reviewCount} reviews)`;
    document.getElementById("hotel-location").textContent = hotel.getLocation();
    document.getElementById("hotel-description").textContent = hotel.description;
    document.getElementById("hotel-price").innerHTML = `$${hotel.price}<small>/night</small>`;
    document.getElementById("book-link").href = `booking.html?id=${hotel.id}`;
    document.getElementById("details-favorite").dataset.id = hotel.id;
}

function renderRooms(hotel) {
    const container = document.getElementById("rooms-list");

    for (const room of roomTypes) {
        const card = document.createElement("article");
        card.className = "room-card";
        card.innerHTML = `
            <div>
                <h3>${room.name}</h3>
                <div class="muted">${room.beds}</div>
            </div>
            <strong>${formatPrice(hotel.getNightPrice(room))}</strong>`;
        container.appendChild(card);
    }
}

function renderAmenities(hotel) {
    const list = document.getElementById("amenities-list");

    hotel.amenities.forEach((amenityId) => {
        const item = document.createElement("li");
        item.textContent = getAmenityLabel(amenityId);
        list.appendChild(item);
    });
}

function renderReviews(hotel) {
    const container = document.getElementById("reviews-list");

    getHotelReviews(hotel).forEach((review) => {
        const card = document.createElement("article");
        card.className = "review-card";
        card.innerHTML = `
            <strong>${review.author}</strong>
            <div class="stars">${getStarString(review.stars)}</div>
            <p>${review.text}</p>`;
        container.appendChild(card);
    });
}

function createThumbnail(src, hotel, position) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-thumb";
    button.dataset.src = src;
    button.setAttribute("aria-label", `Show photo ${position}`);
    button.appendChild(hotel.createImage(src, "", `${hotel.name}, photo ${position}`));
    return button;
}

function showMainImage(src, altText) {
    const mainImage = document.getElementById("main-image");
    // Remove the placeholder mark, so a new broken photo is replaced again.
    mainImage.classList.remove("is-placeholder");
    mainImage.src = src;
    mainImage.alt = altText;
}

function renderGallery(hotel) {
    const gallery = document.getElementById("hotel-gallery");

    showMainImage(hotel.getMainImage(), hotel.name);

    hotel.images.forEach((src, index) => {
        gallery.appendChild(createThumbnail(src, hotel, index + 1));
    });

    gallery.firstElementChild.classList.add("active");
}

function handleGalleryClick(event) {
    const thumbnail = event.target.closest(".gallery-thumb");
    if (!thumbnail) {
        return;
    }

    const hotel = getCurrentHotel();
    const position = [...thumbnail.parentElement.children].indexOf(thumbnail) + 1;
    showMainImage(thumbnail.dataset.src, `${hotel.name}, photo ${position}`);

    document.querySelectorAll(".gallery-thumb").forEach((button) => {
        button.classList.toggle("active", button === thumbnail);
    });
}

function showTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach((button) => {
        const isActive = button.dataset.tab === tabName;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", isActive);
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== `tab-${tabName}`);
    });
}

function handleTabClick(event) {
    const button = event.target.closest(".tab-btn");
    if (button) {
        showTab(button.dataset.tab);
    }
}

function showNotFound() {
    document.getElementById("hotel-content").classList.add("hidden");
    document.getElementById("hotel-not-found").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    const hotel = getCurrentHotel();

    if (!hotel) {
        showNotFound();
        return;
    }

    renderHotelHeader(hotel);
    addToRecent(hotel.id);
    renderGallery(hotel);
    renderRooms(hotel);
    renderAmenities(hotel);
    renderReviews(hotel);
    updateFavoriteButtons();

    document.getElementById("hotel-gallery").addEventListener("click", handleGalleryClick);
    document.getElementById("hotel-tabs").addEventListener("click", handleTabClick);
});