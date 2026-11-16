class Hotel {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.city = data.city;
        this.country = data.country;
        this.lat = data.lat;
        this.lon = data.lon;
        this.stars = data.stars;
        this.rating = data.rating;
        this.reviewCount = data.reviewCount;
        this.price = data.price;
        this.popular = data.popular;
        this.amenities = [...data.amenities];
        this.description = data.description;
    }

    getStars() {
        return getStarString(this.stars);
    }

    getLocation() {
        return `${this.city}, ${this.country}`;
    }

    getFormattedPrice() {
        return formatPrice(this.price);
    }

    getDetailsUrl() {
        return `hotel-details.html?id=${this.id}`;
    }

    getNightPrice(room) {
        return Math.round(this.price * room.priceFactor);
    }

    hasAmenity(amenityId) {
        return this.amenities.includes(amenityId);
    }

    matchesSearch(query) {
        if (query === "") {
            return true;
        }
        const searchableText = `${this.name} ${this.city} ${this.country}`.toLowerCase();
        return searchableText.includes(query.toLowerCase());
    }

    createCard(layout) {
        const article = document.createElement("article");
        const favoriteButton = `<button class="favorite-btn" type="button" data-id="${this.id}" aria-label="Add ${this.name} to favorites">♡</button>`;

        if (layout === "row") {
            article.className = "hotel-row";
            article.innerHTML = `
                <div class="image-placeholder"></div>
                <div>
                    <h3>${this.name}</h3>
                    <div class="stars">${this.getStars()}</div>
                    <div class="muted">${this.getLocation()}</div>
                    <strong>${this.getFormattedPrice()}</strong>
                </div>
                <div class="hotel-row-actions">
                    ${favoriteButton}
                    <a class="btn" href="${this.getDetailsUrl()}">View</a>
                </div>`;
        } else {
            article.className = "hotel-card";
            article.innerHTML = `
                <div class="image-placeholder"></div>
                <h3>${this.name}</h3>
                <div class="stars">${this.getStars()}</div>
                <div class="muted">${this.getLocation()}</div>
                <div class="price">${this.getFormattedPrice()}</div>
                <div class="card-actions">
                    ${favoriteButton}
                    <a class="btn" href="${this.getDetailsUrl()}">View Hotel</a>
                </div>`;
        }

        return article;
    }
}