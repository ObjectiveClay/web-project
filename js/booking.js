//Participant: Abilmansur
const bookingForm = document.getElementById("booking-form");
const hotelSelect = document.getElementById("booking-hotel");
const roomSelect = document.getElementById("booking-room");
const checkinInput = document.getElementById("booking-checkin");
const checkoutInput = document.getElementById("booking-checkout");
const guestsInput = document.getElementById("booking-guests");
const bookingSuccess = document.getElementById("booking-success");

function fillHotelOptions() {
    hotels.forEach((hotel) => {
        const option = document.createElement("option");
        option.value = hotel.id;
        option.textContent = `${hotel.name} — ${hotel.city}`;
        hotelSelect.appendChild(option);
    });
}

function fillRoomOptions() {
    roomTypes.forEach((room, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${room.name} (${room.beds})`;
        roomSelect.appendChild(option);
    });
}

function getTodayString() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${month}-${day}`;
}

function parseDate(value) {
    return new Date(`${value}T00:00:00`);
}

function calculateNights(checkin, checkout) {
    if (checkin === "" || checkout === "") {
        return 0;
    }
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const nights = Math.round((parseDate(checkout) - parseDate(checkin)) / millisecondsPerDay);
    return nights > 0 ? nights : 0;
}

function formatDate(value) {
    if (value === "") {
        return "—";
    }
    return parseDate(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function getSelectedRoom() {
    return roomSelect.value === "" ? null : roomTypes[Number(roomSelect.value)];
}

function getNightPrice(hotel, room) {
    return Math.round(hotel.price * room.priceFactor);
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function updateSummary() {
    const hotel = findHotelById(hotelSelect.value);
    const room = getSelectedRoom();
    const nights = calculateNights(checkinInput.value, checkoutInput.value);
    const guests = Number(guestsInput.value);

    setText("summary-hotel", hotel ? hotel.name : "Choose a hotel");
    setText("summary-stars", hotel ? getStarString(hotel.stars) : "");
    setText("summary-room", room ? room.name : "—");
    setText("summary-checkin", formatDate(checkinInput.value));
    setText("summary-checkout", formatDate(checkoutInput.value));
    setText("summary-guests", guests > 0 ? `${guests} ${guests === 1 ? "guest" : "guests"}` : "—");
    setText("summary-nights", nights > 0 ? nights : "—");

    if (hotel && room) {
        const nightPrice = getNightPrice(hotel, room);
        setText("summary-price", `$${nightPrice}`);
        setText("summary-total", nights > 0 ? `Total: $${nightPrice * nights}` : "Total: —");
    } else {
        setText("summary-price", "—");
        setText("summary-total", "Total: —");
    }
}

function getBookingError(input) {
    const value = input.value.trim();

    switch (input.id) {
        case "booking-name":
            if (value === "") return "Please enter your full name.";
            if (value.length < 3) return "Name must be at least 3 characters.";
            if (!/^[A-Za-zА-Яа-яЁё\s'-]+$/.test(value)) return "Name can contain only letters, spaces and hyphens.";
            return "";

        case "booking-email":
            if (value === "") return "Please enter your email.";
            if (!isValidEmail(value)) return "Enter a valid email, for example name@mail.com.";
            return "";

        case "booking-phone": {
            const digits = value.replace(/\D/g, "");
            if (value === "") return "Please enter your phone number.";
            if (!/^[+\d\s()-]+$/.test(value) || digits.length < 10 || digits.length > 15) {
                return "Enter a valid phone number, for example +7 700 123 4567.";
            }
            return "";
        }

        case "booking-hotel":
            return value === "" ? "Please choose a hotel." : "";

        case "booking-room":
            return value === "" ? "Please choose a room type." : "";

        case "booking-checkin":
            if (value === "") return "Please choose a check-in date.";
            if (value < getTodayString()) return "Check-in cannot be in the past.";
            return "";

        case "booking-checkout":
            if (value === "") return "Please choose a check-out date.";
            if (checkinInput.value !== "" && value <= checkinInput.value) return "Check-out must be after check-in.";
            return "";

        case "booking-guests": {
            const guests = Number(value);
            if (value === "") return "Please enter the number of guests.";
            if (!Number.isInteger(guests) || guests < 1 || guests > 6) return "Guests must be a whole number from 1 to 6.";
            return "";
        }

        default:
            return "";
    }
}

function setDateLimits() {
    checkinInput.min = getTodayString();
    checkoutInput.min = getTodayString();
}

function prefillHotelFromUrl() {
    const hotelId = getQueryParam("id");
    if (hotelId && findHotelById(hotelId)) {
        hotelSelect.value = hotelId;
    }
}

function handleBookingInput(event) {
    const field = event.target;

    if (field.classList.contains("invalid")) {
        validateField(field, getBookingError);
    }

    if (field === checkinInput) {
        checkoutInput.min = checkinInput.value || getTodayString();
        if (checkoutInput.value !== "") {
            validateField(checkoutInput, getBookingError);
        }
    }

    updateSummary();
}

function handleBookingFieldLeave(event) {
    const field = event.target;
    if (field.closest(".field") && field.value.trim() !== "") {
        validateField(field, getBookingError);
    }
}

function handleBookingSubmit(event) {
    event.preventDefault();
    $("#booking-success").hide();

    if (!validateForm(bookingForm, getBookingError)) {
        return;
    }

    const hotel = findHotelById(hotelSelect.value);
    const room = getSelectedRoom();
    const nights = calculateNights(checkinInput.value, checkoutInput.value);
    const total = getNightPrice(hotel, room) * nights;
    const firstName = document.getElementById("booking-name").value.trim().split(/\s+/)[0];

    bookingSuccess.textContent =
        `Thank you, ${firstName}! Your ${room.name} at ${hotel.name} is booked ` +
        `for ${nights} ${nights === 1 ? "night" : "nights"}. Total: $${total}.`;

    $("#booking-success").removeClass("hidden").hide().fadeIn(400);

    bookingForm.reset();
    setDateLimits();
    prefillHotelFromUrl();
    updateSummary();
}

document.addEventListener("DOMContentLoaded", () => {
    fillHotelOptions();
    fillRoomOptions();
    setDateLimits();
    prefillHotelFromUrl();
    updateSummary();

    bookingForm.addEventListener("input", handleBookingInput);
    bookingForm.addEventListener("focusout", handleBookingFieldLeave);
    bookingForm.addEventListener("submit", handleBookingSubmit);
});