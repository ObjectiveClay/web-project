
const weatherService = new WeatherService();
let lastWeatherRequest = null;

function formatWeatherDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}

function formatTemperature(value) {
    return value === null ? "—" : `${value}°`;
}

function setWeatherState(state, message) {
    const status = document.getElementById("weather-status");
    status.className = `weather-status is-${state}`;
    status.textContent = message;

    if (state === "error") {
        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.className = "retry-btn";
        retryButton.textContent = "Retry";
        retryButton.addEventListener("click", () => {
            loadWeather(...lastWeatherRequest);
        });
        status.append(" ", retryButton);
    }
}

function createWeatherCard(day) {
    const info = WeatherService.getWeatherInfo(day.code);
    const card = document.createElement("article");
    card.className = "weather-card";
    card.innerHTML = `
        <div class="weather-date">${formatWeatherDate(day.date)}</div>
        <div class="weather-icon" aria-hidden="true">${info.icon}</div>
        <div>${info.label}</div>
        <strong>${formatTemperature(day.max)} / ${formatTemperature(day.min)}</strong>
        ${day.rain !== null ? `<div class="muted">Rain: ${day.rain}%</div>` : ""}`;
    return card;
}

function getWeatherDateProblem(startDate, endDate) {
    const today = WeatherService.toDateString(new Date());
    const lastDate = WeatherService.getLastForecastDate();

    if (startDate === "" || endDate === "") {
        return { state: "error", message: "Please choose both dates." };
    }
    if (startDate < today) {
        return { state: "error", message: "The start date cannot be in the past." };
    }
    if (endDate < startDate) {
        return { state: "error", message: "The end date must be after the start date." };
    }
    if (startDate > lastDate) {
        return { state: "empty", message: "No forecast for these dates yet. The forecast is available only 16 days ahead." };
    }
    return null;
}

async function loadWeather(hotel, startDate, endDate) {
    const list = document.getElementById("weather-list");
    list.innerHTML = "";

    const problem = getWeatherDateProblem(startDate, endDate);
    if (problem) {
        setWeatherState(problem.state, problem.message);
        return;
    }

    const lastDate = WeatherService.getLastForecastDate();
    const requestEnd = endDate > lastDate ? lastDate : endDate;
    lastWeatherRequest = [hotel, startDate, endDate];

    setWeatherState("loading", `Loading the forecast for ${hotel.city}...`);

    try {
        const days = await weatherService.getForecast(hotel.lat, hotel.lon, startDate, requestEnd);

        if (days.length === 0) {
            setWeatherState("empty", "The weather service has no data for these dates.");
            return;
        }

        days.forEach((day) => list.appendChild(createWeatherCard(day)));

        const note = requestEnd !== endDate ? " Later days are not available yet." : "";
        setWeatherState("success", `Forecast for ${hotel.city}: ${days.length} days.${note}`);
    } catch (error) {
        console.warn("Weather request failed:", error);
        setWeatherState("error", "Could not load the forecast. Check your internet connection and try again.");
    }
}

function updateBookLink(hotel, startDate, endDate) {
    document.getElementById("book-link").href =
        `booking.html?id=${hotel.id}&checkin=${startDate}&checkout=${endDate}`;
}

function setDefaultWeatherDates(startInput, endInput) {
    const today = new Date();
    startInput.value = WeatherService.toDateString(today);
    endInput.value = WeatherService.toDateString(WeatherService.addDays(today, 6));
    startInput.min = startInput.value;
    endInput.min = startInput.value;
}

document.addEventListener("DOMContentLoaded", () => {
    const hotel = getCurrentHotel();
    if (!hotel) {
        return;
    }

    const form = document.getElementById("weather-form");
    const startInput = document.getElementById("weather-start");
    const endInput = document.getElementById("weather-end");

    setDefaultWeatherDates(startInput, endInput);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateBookLink(hotel, startInput.value, endInput.value);
        loadWeather(hotel, startInput.value, endInput.value);
    });

    startInput.addEventListener("change", () => {
        endInput.min = startInput.value;
    });

    loadWeather(hotel, startInput.value, endInput.value);
});