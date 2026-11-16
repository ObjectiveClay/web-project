function formatPrice(price) {
    return `$${price} / night`;
}

function getStarString(stars) {
    let result = "";
    for (let i = 0; i < stars; i++) {
        result += "★";
    }
    return result;
}

function findHotelById(id) {
    const targetId = Number(id);
    return hotels.find((hotel) => hotel.id === targetId) || null;
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function renderHotels(hotelsToShow, container, layout) {
    container.innerHTML = "";
    hotelsToShow.forEach((hotel) => {
        container.appendChild(hotel.createCard(layout));
    });
    updateFavoriteButtons();
}

function loadBookings() {
    return bookingsStorage.get()
        .map((data) => Booking.fromJSON(data))
        .filter((booking) => booking.isValid());
}

function saveBookings(bookings) {
    return bookingsStorage.save(bookings);
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(input, message) {
    const error = input.closest(".field").querySelector(".error-message");
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    error.textContent = message;
}

function clearFieldError(input) {
    const error = input.closest(".field").querySelector(".error-message");
    input.classList.remove("invalid");
    input.setAttribute("aria-invalid", "false");
    error.textContent = "";
}

function validateField(input, getError) {
    const message = getError(input);
    if (message !== "") {
        showFieldError(input, message);
        return false;
    }
    clearFieldError(input);
    return true;
}

function validateForm(form, getError) {
    let isValid = true;
    let firstInvalid = null;

    for (const input of form.querySelectorAll("input, select, textarea")) {
        if (!validateField(input, getError)) {
            isValid = false;
            if (firstInvalid === null) {
                firstInvalid = input;
            }
        }
    }

    if (firstInvalid) {
        firstInvalid.focus();
    }
    return isValid;
}
// Images

const PLACEHOLDER_IMAGE = "images/placeholder.svg";

function useImagePlaceholder(image) {
    if (image.src.endsWith(PLACEHOLDER_IMAGE)) {
        return;
    }
    image.classList.add("is-placeholder");
    image.src = PLACEHOLDER_IMAGE;
}

document.addEventListener("error", (event) => {
    if (event.target.tagName === "IMG") {
        useImagePlaceholder(event.target);
    }
}, true);

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img[src]").forEach((image) => {
        if (image.complete && image.naturalWidth === 0) {
            useImagePlaceholder(image);
        }
    });
});