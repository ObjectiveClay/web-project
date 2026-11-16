class Booking {
    constructor(data) {
        this.id = data.id || Booking.createId();
        this.hotelId = Number(data.hotelId);
        this.roomIndex = Number(data.roomIndex);
        this.checkin = data.checkin;
        this.checkout = data.checkout;
        this.guests = Number(data.guests);
        this.guestName = data.guestName || "";
        this.email = data.email || "";
        this.phone = data.phone || "";
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    static createId() {
        return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    static fromJSON(data) {
        return new Booking(data);
    }

    static parseDate(value) {
        return new Date(`${value}T00:00:00`);
    }

    getHotel() {
        return findHotelById(this.hotelId);
    }

    getRoom() {
        return roomTypes[this.roomIndex] || null;
    }

    getNights() {
        if (!this.checkin || !this.checkout) {
            return 0;
        }
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const difference = Booking.parseDate(this.checkout) - Booking.parseDate(this.checkin);
        const nights = Math.round(difference / millisecondsPerDay);
        return nights > 0 ? nights : 0;
    }

    getNightPrice() {
        const hotel = this.getHotel();
        const room = this.getRoom();
        return hotel && room ? hotel.getNightPrice(room) : 0;
    }

    getTotal() {
        return this.getNightPrice() * this.getNights();
    }

    isValid() {
        return this.getHotel() !== null &&
            this.getRoom() !== null &&
            this.getNights() > 0 &&
            Number.isInteger(this.guests) &&
            this.guests >= 1 &&
            this.guests <= 6;
    }

    toJSON() {
        return {
            id: this.id,
            hotelId: this.hotelId,
            roomIndex: this.roomIndex,
            checkin: this.checkin,
            checkout: this.checkout,
            guests: this.guests,
            guestName: this.guestName,
            email: this.email,
            phone: this.phone,
            createdAt: this.createdAt
        };
    }
}