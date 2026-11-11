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

function getLocation(hotel) {
    return `${hotel.city}, ${hotel.country}`;
}

function findHotelById(id) {
    const targetId = Number(id);
    for (const hotel of hotels) {
        if (hotel.id === targetId) {
            return hotel;
        }
    }
    return null;
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function createHotelCard(hotel, layout) {
    const article = document.createElement("article");
    const detailsUrl = `hotel-details.html?id=${hotel.id}`;
    const favoriteButton = `<button class="favorite-btn" type="button" data-id="${hotel.id}" aria-label="Add ${hotel.name} to favorites">♡</button>`;

    if (layout === "row") {
        article.className = "hotel-row";
        article.innerHTML = `
            <div class="image-placeholder"></div>
            <div>
                <h3>${hotel.name}</h3>
                <div class="stars">${getStarString(hotel.stars)}</div>
                <div class="muted">${getLocation(hotel)}</div>
                <strong>${formatPrice(hotel.price)}</strong>
            </div>
            <div class="hotel-row-actions">
                ${favoriteButton}
                <a class="btn" href="${detailsUrl}">View</a>
            </div>`;
    } else {
        article.className = "hotel-card";
        article.innerHTML = `
            <div class="image-placeholder"></div>
            <h3>${hotel.name}</h3>
            <div class="stars">${getStarString(hotel.stars)}</div>
            <div class="muted">${getLocation(hotel)}</div>
            <div class="price">${formatPrice(hotel.price)}</div>
            <div class="card-actions">
                ${favoriteButton}
                <a class="btn" href="${detailsUrl}">View Hotel</a>
            </div>`;
    }

    return article;
}

function renderHotels(hotelsToShow, container, layout) {
    container.innerHTML = "";
    hotelsToShow.forEach((hotel) => {
        container.appendChild(createHotelCard(hotel, layout));
    });
    updateFavoriteButtons();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//Participant: Abilmansur
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