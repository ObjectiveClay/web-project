class BookingList {
    constructor(storage) {
        this.storage = storage;
        this.bookings = this.load();
    }

    load() {
        return this.storage.get()
            .map((data) => Booking.fromJSON(data))
            .filter((booking) => booking.isValid());
    }

    reload() {
        this.bookings = this.load();
    }

    save() {
        return this.storage.save(this.bookings);
    }

    get count() {
        return this.bookings.length;
    }

    getAll() {
        return [...this.bookings].sort((a, b) => a.checkin.localeCompare(b.checkin));
    }

    findById(id) {
        return this.bookings.find((booking) => booking.id === id) || null;
    }

   
    add(booking) {
        if (!booking.isValid()) {
            return false;
        }
        this.bookings.push(booking);
        return this.save();
    }

    update(id, changes) {
        const index = this.bookings.findIndex((booking) => booking.id === id);
        if (index === -1) {
            return false;
        }

        const updated = new Booking({ ...this.bookings[index].toJSON(), ...changes });
        if (!updated.isValid()) {
            return false;
        }

        this.bookings[index] = updated;
        return this.save();
    }

    remove(id) {
        const oldCount = this.bookings.length;
        this.bookings = this.bookings.filter((booking) => booking.id !== id);
        if (this.bookings.length === oldCount) {
            return false;
        }
        return this.save();
    }

    clear() {
        this.bookings = [];
        this.storage.clear();
    }
}