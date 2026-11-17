
const amenities = [
    { id: "wifi", label: "Free Wi-Fi" },
    { id: "breakfast", label: "Breakfast" },
    { id: "parking", label: "Free parking" },
    { id: "pool", label: "Swimming pool" }
];

const hotelData = [
    {
        id: 1, name: "The Veil Hotel", city: "Astana", country: "Kazakhstan", lat: 51.17, lon: 71.43,
        stars: 5, rating: 4.8, reviewCount: 324, price: 360, popular: true,
        amenities: ["wifi", "breakfast", "parking", "pool"],
        description: "A modern boutique hotel offering cozy accommodation in the capital."
    },
    {
        id: 2, name: "Sheraton", city: "Almaty", country: "Kazakhstan", lat: 43.24, lon: 76.89,
        stars: 5, rating: 4.7, reviewCount: 281, price: 288, popular: true,
        amenities: ["wifi", "breakfast", "pool"],
        description: "A classic city hotel with spacious rooms and mountain views."
    },
    {
        id: 3, name: "Wyndham", city: "Dubai", country: "UAE", lat: 25.2, lon: 55.27,
        stars: 5, rating: 4.5, reviewCount: 412, price: 180, popular: true,
        amenities: ["wifi", "parking", "pool"],
        description: "A comfortable stay close to the city's business district."
    },
    {
        id: 4, name: "Steppe Inn", city: "Astana", country: "Kazakhstan", lat: 51.17, lon: 71.43,
        stars: 3, rating: 4.1, reviewCount: 96, price: 45, popular: false,
        amenities: ["wifi", "parking"],
        description: "A simple and affordable option near the railway station."
    },
    {
        id: 5, name: "Alatau Lodge", city: "Almaty", country: "Kazakhstan", lat: 43.24, lon: 76.89,
        stars: 4, rating: 4.4, reviewCount: 158, price: 85, popular: false,
        amenities: ["wifi", "breakfast", "parking"],
        description: "A quiet lodge at the foot of the mountains."
    },
    {
        id: 6, name: "City Nest Hostel", city: "Almaty", country: "Kazakhstan", lat: 43.24, lon: 76.89,
        stars: 3, rating: 3.9, reviewCount: 74, price: 30, popular: false,
        amenities: ["wifi"],
        description: "A friendly hostel for budget travelers in the city center."
    },
    {
        id: 7, name: "Silk Road Hotel", city: "Shymkent", country: "Kazakhstan", lat: 42.32, lon: 69.59,
        stars: 4, rating: 4.2, reviewCount: 112, price: 120, popular: false,
        amenities: ["wifi", "breakfast", "parking"],
        description: "Warm hospitality and traditional cuisine in the south of the country."
    },
    {
        id: 8, name: "Caspian Breeze", city: "Aktau", country: "Kazakhstan", lat: 43.65, lon: 51.17,
        stars: 4, rating: 4.3, reviewCount: 89, price: 95, popular: false,
        amenities: ["wifi", "breakfast", "pool"],
        description: "A seaside hotel just a short walk from the beach."
    },
    {
        id: 9, name: "Palm Marina Resort", city: "Dubai", country: "UAE", lat: 25.2, lon: 55.27,
        stars: 5, rating: 4.6, reviewCount: 367, price: 240, popular: false,
        amenities: ["wifi", "breakfast", "parking", "pool"],
        description: "A waterfront resort with private beach access."
    },
    {
        id: 10, name: "Golden Dunes Hotel", city: "Dubai", country: "UAE", lat: 25.2, lon: 55.27,
        stars: 4, rating: 4.2, reviewCount: 203, price: 150, popular: false,
        amenities: ["wifi", "breakfast", "pool"],
        description: "A bright, comfortable hotel near the shopping districts."
    },
    {
        id: 11, name: "Bosphorus View", city: "Istanbul", country: "Turkey", lat: 41.01, lon: 28.98,
        stars: 4, rating: 4.4, reviewCount: 245, price: 130, popular: false,
        amenities: ["wifi", "breakfast"],
        description: "A historic building with terraces overlooking the water."
    },
    {
        id: 12, name: "Old Town Guesthouse", city: "Istanbul", country: "Turkey", lat: 41.01, lon: 28.98,
        stars: 3, rating: 4.0, reviewCount: 67, price: 60, popular: false,
        amenities: ["wifi", "breakfast"],
        description: "A small family-run guesthouse close to the main sights."
    }
];

// Room types for the Rooms tab and the booking form.
const roomTypes = [
    { name: "Standard Room", beds: "1 queen bed", priceFactor: 1 },
    { name: "Deluxe Room", beds: "1 king bed", priceFactor: 1.4 },
    { name: "Family Suite", beds: "2 queen beds", priceFactor: 1.8 }
];

// Demo reviews for the Reviews tab.
const sampleReviews = [
    { author: "Aigerim", stars: 5, text: "Very clean rooms and friendly staff." },
    { author: "Daniyar", stars: 4, text: "Good location, but check-in took a while." },
    { author: "Sofia", stars: 5, text: "Great breakfast and a comfortable bed." },
    { author: "Marat", stars: 4, text: "Good value for the price. Would stay again." },
    { author: "Elena", stars: 5, text: "Quiet room and helpful reception." },
    { author: "Timur", stars: 3, text: "Fine for a short trip, the room was small." }
];

// Every hotel becomes a Hotel object with its own methods.
const hotels = hotelData.map((data) => new Hotel(data));

// One StorageService object per saved value.
const themeStorage = new StorageService("hotelbook-theme", "light");
const favoritesStorage = new StorageService("hotelbook-favorites", []);
const bookingsStorage = new StorageService("hotelbook-bookings", []);

// Recently viewed hotels (Participant 2).
const recentStorage = new StorageService("hotelbook-recent", []);