# HotelBook

HotelBook is a client-side hotel booking web application. Users can search and filter hotels, read hotel details, check the weather forecast for their trip, save favorites, book rooms, manage their bookings and see travel statistics.

The project was built in three stages with the same topic and group:
- **Midterm:** multi-page responsive website (HTML, CSS)
- **Endterm:** JavaScript, DOM, events, form validation, jQuery
- **Final:** API integration, OOP, localStorage, CRUD, statistics



## Group members and contributions
| Member | Endterm | Final |
|---|---|---|
| Miras Bimagambet | Hotel data arrays, rendering hotels, search, filters, sorting | Classes `Hotel`, `Booking`, `StorageService`, `StatsPanel`; refactoring to OOP; statistics dashboard with chart |
| Alikhan Kadashov | Hotel details page, tabs, gallery, favorites, theme switcher | Weather forecast with Open-Meteo API (TODO: add extra features if done) |
| Abilmansur Kaiyr | Form validation, booking summary, jQuery effects | Class `BookingList`; My Bookings CRUD; saving bookings; README |

## Technologies
- HTML5, CSS3 (CSS variables, Grid, Flexbox, media queries)
- JavaScript ES6+ (classes, arrow functions, array methods, `fetch`, `async`/`await`)
- jQuery 3.7.1
- Chart.js 4.4.1
- Open-Meteo Weather API
- localStorage

## How to run
1. Download or clone the repository.
2. Open `index.html` in a browser, or use the VS Code "Live Server" extension.
3. An internet connection is needed for jQuery, Chart.js and the weather API. Without it the site still opens and shows clear error messages.

No installation, build step or API key is needed.

## Pages
| Page | Description |
|---|---|
| `index.html` | Home: search form and popular hotels |
| `hotels.html` | Hotel list with search, filters, sorting and favorites |
| `hotel-details.html` | Hotel details: tabs, gallery, rooms, reviews, weather |
| `booking.html` | Booking form with validation and live price summary |
| `my-bookings.html` | Saved bookings (CRUD) and statistics |
| `about.html` | About the company |
| `contact.html` | Contact form and FAQ |
| `sitemap.html` | Website map |
| `project-description.html` | Project description |

## Final-stage features
1. **Weather forecast (API).** The hotel page shows the forecast for the hotel's city using the Open-Meteo API, with loading, success, empty and error states.
2. **Object-oriented code.** Hotels, bookings, saved data and statistics are handled by classes (see the table below).
3. **Saved bookings (localStorage).** Bookings are saved in the browser and restored when the page is opened again. Broken saved data is reset safely.
4. **CRUD for bookings.** On My Bookings the user can create, view, edit and cancel bookings, or clear all of them.
5. **Statistics dashboard.** My Bookings shows the number of bookings, nights, total and average price, top city, and a bar chart of money spent by city.

TODO: add any extra features (for example currency converter, recently viewed hotels).

## API information
| | |
|---|---|
| Service | Open-Meteo — https://open-meteo.com |
| API key | Not needed, so no secret is stored in the code |
| Used data | Daily weather code, maximum and minimum temperature |
| Request | `fetch` with `async`/`await`, coordinates come from `lat` and `lon` in `js/data.js` |
| States | Loading message → forecast cards / "no forecast for these dates" / error message with Retry |

Open-Meteo gives a forecast only about 16 days ahead. For later dates the empty state is shown.

## Classes (OOP)
| Class | File | Responsibility | Objects |
|---|---|---|---|
| `Hotel` | `js/classes/Hotel.js` | Hotel data, price for a room, search check, card element | 12 hotels in `data.js` |
| `Booking` | `js/classes/Booking.js` | One reservation: nights, total price, validity, JSON | One per saved booking |
| `StorageService` | `js/classes/StorageService.js` | Safe read, save and clear of one localStorage key | Theme, favorites, bookings |
| `StatsPanel` | `js/classes/StatsPanel.js` | Statistics cards and Chart.js chart | One on My Bookings |
| `BookingList` | `js/classes/BookingList.js` | Add, update, delete and clear bookings | TODO: Participant 3 |

## localStorage
| Key | Value | How to clear |
|---|---|---|
| `hotelbook-theme` | `"light"` or `"dark"` | Theme button |
| `hotelbook-favorites` | Array of hotel ids, e.g. `[1, 9]` | ✕ in the Favorites panel |
| `hotelbook-bookings` | Array of booking objects (JSON) | Cancel / Clear all on My Bookings |

All values are stored as JSON. If a value is missing, broken or has a wrong type, `StorageService` resets it to a default value, so the page keeps working.

## How to test
**Final features**
1. **Weather:** open any hotel, go to the Weather tab. Turn off the internet and press Retry to see the error state.
2. **Bookings:** book a room on `booking.html`, then open My Bookings. The booking is there after a page reload.
3. **CRUD:** edit the dates of a booking, then cancel it. Use Clear all to remove everything.
4. **Statistics:** add bookings in different cities. The cards and chart update.
5. **Broken data:** in the console run `localStorage.setItem("hotelbook-bookings", "broken")` and reload My Bookings. The page shows "no bookings" instead of an error.

**Earlier features**
1. Home: search `Dubai`.
2. Hotels: filters, sorting, Reset filters, favorites.
3. Hotel details: tabs and gallery.
4. Booking and Contact: submit empty forms to see the errors.
5. Contact: open the FAQ questions.
6. Theme: switch to dark and reload.
7. Mobile: make the window narrower than 600px and use ☰ Menu.

## Project structure
```
index.html, hotels.html, hotel-details.html, booking.html, my-bookings.html,
about.html, contact.html, sitemap.html, project-description.html
style.css
js/
  classes/
    StorageService.js   safe localStorage access
    Hotel.js            hotel model
    Booking.js          booking model
    StatsPanel.js       statistics and chart
  data.js               hotel data, rooms, reviews, objects
  common.js             shared helpers and form validation
  main.js               theme and favorites (every page)
  home.js               home page
  hotels.js             search, filters, sorting
  details.js            hotel details, tabs, gallery
  weather.js            weather API (TODO: Participant 2)
  booking.js            booking form
  my-bookings.js        bookings CRUD
  stats.js              statistics page start
  contact.js            contact form
  effects.js            jQuery effects
```

## Limitations
- Hotel data and reviews are demo data.
- Bookings are stored only in this browser; nothing is sent to a server.