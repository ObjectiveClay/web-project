// My Bookings page: read, edit, cancel and clear saved bookings (CRUD).
// Abilmansur ofcourse 
const bookingList = new BookingList(bookingsStorage);
const bookingsContainer = document.getElementById("bookings-list");
const bookingsCount = document.getElementById("bookings-count");
const clearBookingsButton = document.getElementById("clear-bookings");

// jQuery: the message fades in, stays for a moment and fades out.
function showBookingsMessage(text) {
    $("#bookings-message")
        .stop(true, true)
        .text(text)
        .removeClass("hidden")
        .hide()
        .fadeIn(300)
        .delay(2500)
        .fadeOut(400);
}

function getPlural(count, word) {
    return `${count} ${count === 1 ? word : `${word}s`}`;
}

function createBookingCard(booking) {
    const hotel = booking.getHotel();
    const room = booking.getRoom();

    const card = document.createElement("article");
    card.className = "booking-card";
    card.dataset.id = booking.id;

    card.appendChild(hotel.createImage(hotel.getMainImage(), "booking-image", hotel.name));

    const info = document.createElement("div");
    info.className = "booking-info";
    info.innerHTML = `
        <h3>${hotel.name}</h3>
        <div class="muted">${hotel.getLocation()}</div>
        <p>${room.name} · ${getPlural(booking.guests, "guest")}</p>
        <p>${formatDate(booking.checkin)} → ${formatDate(booking.checkout)} (${getPlural(booking.getNights(), "night")})</p>
        <strong>Total: $${booking.getTotal()}</strong>`;

    // The name was typed by the user, so it goes in with textContent, not innerHTML.
    const guest = document.createElement("p");
    guest.className = "muted";
    guest.textContent = `Guest: ${booking.guestName}`;
    info.appendChild(guest);

    const actions = document.createElement("div");
    actions.className = "booking-actions";
    actions.innerHTML = `
        <button type="button" data-action="edit">Edit</button>
        <button type="button" class="danger-btn" data-action="delete">Cancel booking</button>`;

    card.append(info, actions);
    return card;
}

function renderBookings() {
    const bookings = bookingList.getAll();
    bookingsContainer.innerHTML = "";

    bookingsCount.textContent = bookings.length > 0
        ? `You have ${getPlural(bookings.length, "booking")}.`
        : "";
    clearBookingsButton.classList.toggle("hidden", bookings.length === 0);

    if (bookings.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.innerHTML = 'No saved bookings yet. <a href="hotels.html">Find a hotel</a> to make your first booking.';
        bookingsContainer.appendChild(empty);
    }

    bookings.forEach((booking) => {
        bookingsContainer.appendChild(createBookingCard(booking));
    });

    // Statistics from stats.js (Participant 1).
    statsPanel.update(bookings);
}

/* ---------- Edit (Update) ---------- */

function createEditForm(booking) {
    const prefix = `edit-${booking.id}`;
    const roomOptions = roomTypes
        .map((room, index) => `<option value="${index}" ${index === booking.roomIndex ? "selected" : ""}>${room.name}</option>`)
        .join("");

    const form = document.createElement("form");
    form.className = "edit-form";
    form.noValidate = true;
    form.dataset.id = booking.id;
    form.innerHTML = `
        <div class="field"><label for="${prefix}-room">Room type</label>
            <select id="${prefix}-room" name="roomIndex">${roomOptions}</select>
            <small class="error-message"></small></div>
        <div class="field"><label for="${prefix}-checkin">Check-in</label>
            <input id="${prefix}-checkin" name="checkin" type="date" value="${booking.checkin}" min="${getTodayString()}">
            <small class="error-message"></small></div>
        <div class="field"><label for="${prefix}-checkout">Check-out</label>
            <input id="${prefix}-checkout" name="checkout" type="date" value="${booking.checkout}" min="${getTodayString()}">
            <small class="error-message"></small></div>
        <div class="field"><label for="${prefix}-guests">Guests (1–6)</label>
            <input id="${prefix}-guests" name="guests" type="number" min="1" max="6" value="${booking.guests}">
            <small class="error-message"></small></div>
        <div class="edit-actions">
            <button type="submit" class="dark">Save changes</button>
            <button type="button" data-action="close-edit">Close</button>
        </div>`;
    return form;
}

function getEditError(input) {
    const value = input.value.trim();
    const checkin = input.form.elements.checkin.value;

    switch (input.name) {
        case "roomIndex":
            return value === "" ? "Please choose a room type." : "";

        case "checkin":
            if (value === "") return "Please choose a check-in date.";
            if (value < getTodayString()) return "Check-in cannot be in the past.";
            return "";

        case "checkout":
            if (value === "") return "Please choose a check-out date.";
            if (checkin !== "" && value <= checkin) return "Check-out must be after check-in.";
            return "";

        case "guests": {
            const guests = Number(value);
            if (!Number.isInteger(guests) || guests < 1 || guests > 6) return "Guests must be a whole number from 1 to 6.";
            return "";
        }

        default:
            return "";
    }
}

function openEditForm(card, id) {
    // Only one edit form per card.
    if (card.querySelector(".edit-form")) {
        return;
    }

    const form = createEditForm(bookingList.findById(id));
    $(form).hide();
    card.appendChild(form);
    $(form).slideDown(250);
    form.elements.roomIndex.focus();
}

function closeEditForm(card) {
    const $form = $(card).find(".edit-form");
    $form.slideUp(200, () => $form.remove());
}

function handleEditSubmit(event) {
    if (!event.target.matches(".edit-form")) {
        return;
    }
    event.preventDefault();

    const form = event.target;
    if (!validateForm(form, getEditError)) {
        return;
    }

    const changes = {
        roomIndex: form.elements.roomIndex.value,
        checkin: form.elements.checkin.value,
        checkout: form.elements.checkout.value,
        guests: form.elements.guests.value
    };

    if (bookingList.update(form.dataset.id, changes)) {
        renderBookings();
        showBookingsMessage("Booking updated.");
    } else {
        showBookingsMessage("Could not save the changes. Please check the data and try again.");
    }
}

function handleEditInput(event) {
    if (event.target.classList.contains("invalid")) {
        validateField(event.target, getEditError);
    }
}

/* ---------- Delete ---------- */

function deleteBooking(card, id) {
    const booking = bookingList.findById(id);
    if (!confirm(`Cancel your booking at ${booking.getHotel().name}?`)) {
        return;
    }

    // jQuery: the card fades out before it is removed.
    $(card).fadeOut(300, () => {
        bookingList.remove(id);
        renderBookings();
        showBookingsMessage("Booking cancelled.");
    });
}

function clearAllBookings() {
    if (!confirm("Delete all your bookings? This cannot be undone.")) {
        return;
    }
    bookingList.clear();
    renderBookings();
    showBookingsMessage("All bookings were deleted.");
}

// One listener for all buttons, because the cards are created again after changes.
function handleBookingsClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const card = button.closest(".booking-card");
    const id = card.dataset.id;

    if (button.dataset.action === "edit") {
        openEditForm(card, id);
    } else if (button.dataset.action === "delete") {
        deleteBooking(card, id);
    } else if (button.dataset.action === "close-edit") {
        closeEditForm(card);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderBookings();

    bookingsContainer.addEventListener("click", handleBookingsClick);
    bookingsContainer.addEventListener("submit", handleEditSubmit);
    bookingsContainer.addEventListener("input", handleEditInput);
    clearBookingsButton.addEventListener("click", clearAllBookings);
});

// A booking made in another tab appears here too.
window.addEventListener("storage", (event) => {
    if (event.key === bookingsStorage.key) {
        bookingList.reload();
        renderBookings();
    }
});