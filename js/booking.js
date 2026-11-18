// Booking page: form validation, live price summary and saving the booking.
// Abilmansur который крутой эщкере
const bookingList = new BookingList(bookingsStorage);

const bookingForm = document.getElementById("booking-form");
const hotelSelect = document.getElementById("booking-hotel");
const roomSelect = document.getElementById("booking-room");
const checkinInput = document.getElementById("booking-checkin");
const checkoutInput = document.getElementById("booking-checkout");
const guestsInput = document.getElementById("booking-guests");
const bookingSuccess = document.getElementById("booking-success");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

// Builds a Booking object from the current form values.
// An empty room select gives -1, so getRoom() returns null.
function createBookingFromForm() {
    return new Booking({
        hotelId: hotelSelect.value,
        roomIndex: roomSelect.value === "" ? -1 : roomSelect.value,
        checkin: checkinInput.value,
        checkout: checkoutInput.value,
        guests: guestsInput.value,
        guestName: document.getElementById("booking-name").value.trim(),
        email: document.getElementById("booking-email").value.trim(),
        phone: document.getElementById("booking-phone").value.trim()
    });
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function updateSummary() {
    const booking = createBookingFromForm();
    const hotel = booking.getHotel();
    const room = booking.getRoom();
    const nights = booking.getNights();
    const guests = booking.guests;

    setText("summary-hotel", hotel ? hotel.name : "Choose a hotel");
    setText("summary-stars", hotel ? hotel.getStars() : "");
    setText("summary-room", room ? room.name : "—");
    setText("summary-checkin", formatDate(booking.checkin));
    setText("summary-checkout", formatDate(booking.checkout));
    setText("summary-guests", guests > 0 ? `${guests} ${guests === 1 ? "guest" : "guests"}` : "—");
    setText("summary-nights", nights > 0 ? nights : "—");
    setText("summary-price", hotel && room ? `$${booking.getNightPrice()}` : "—");
    setText("summary-total", hotel && room && nights > 0 ? `Total: $${booking.getTotal()}` : "Total: —");
}

// Returns the error text for one field, or "" if it is valid.
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

        // Dates in "YYYY-MM-DD" format can be compared as plain strings.
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
    checkoutInput.min = checkinInput.value || getTodayString();
}

// The hotel comes from the "Book Now" link: booking.html?id=3
function prefillHotelFromUrl() {
    const hotelId = getQueryParam("id");
    if (hotelId && findHotelById(hotelId)) {
        hotelSelect.value = hotelId;
    }
}

// Dates come from the Weather tab: booking.html?id=3&checkin=...&checkout=...
function prefillDatesFromUrl() {
    const checkin = getQueryParam("checkin");
    const checkout = getQueryParam("checkout");

    if (checkin && DATE_PATTERN.test(checkin)) {
        checkinInput.value = checkin;
    }
    if (checkout && DATE_PATTERN.test(checkout)) {
        checkoutInput.value = checkout;
    }
}

// While typing, a field is re-checked only if it already shows an error.
function handleBookingInput(event) {
    const field = event.target;

    if (field.classList.contains("invalid")) {
        validateField(field, getBookingError);
    }

    if (field === checkinInput) {
        setDateLimits();
        if (checkoutInput.value !== "") {
            validateField(checkoutInput, getBookingError);
        }
    }

    updateSummary();
}

// When the user leaves a filled field, it is checked right away.
function handleBookingFieldLeave(event) {
    const field = event.target;
    if (field.closest(".field") && field.value.trim() !== "") {
        validateField(field, getBookingError);
    }
}

function showBookingResult(message, isError) {
    bookingSuccess.textContent = message;
    bookingSuccess.classList.toggle("is-error", isError);

    if (!isError) {
        const link = document.createElement("a");
        link.href = "my-bookings.html";
        link.textContent = "View my bookings →";
        bookingSuccess.append(" ", link);
    }

    // jQuery effect: the message fades in so the user notices it.
    $("#booking-success").removeClass("hidden").hide().fadeIn(400);
}

function handleBookingSubmit(event) {
    event.preventDefault();
    $("#booking-success").hide();

    if (!validateForm(bookingForm, getBookingError)) {
        return;
    }

    const booking = createBookingFromForm();

    if (!bookingList.add(booking)) {
        showBookingResult("Sorry, the booking could not be saved in this browser. Please try again.", true);
        return;
    }

    const hotel = booking.getHotel();
    const nights = booking.getNights();
    const firstName = booking.guestName.split(/\s+/)[0];

    showBookingResult(
        `Thank you, ${firstName}! Your ${booking.getRoom().name} at ${hotel.name} is booked ` +
        `for ${nights} ${nights === 1 ? "night" : "nights"}. Total: $${booking.getTotal()}.`,
        false
    );

    bookingForm.reset();
    prefillHotelFromUrl();
    setDateLimits();
    updateSummary();
}

document.addEventListener("DOMContentLoaded", () => {
    fillHotelOptions();
    fillRoomOptions();
    prefillHotelFromUrl();
    prefillDatesFromUrl();
    setDateLimits();
    updateSummary();

    bookingForm.addEventListener("input", handleBookingInput);
    bookingForm.addEventListener("focusout", handleBookingFieldLeave);
    bookingForm.addEventListener("submit", handleBookingSubmit);
});