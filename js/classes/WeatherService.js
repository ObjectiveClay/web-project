class WeatherService {
    static MAX_DAYS_AHEAD = 15;

    static WEATHER_TYPES = [
        { codes: [0], label: "Clear sky", icon: "☀️" },
        { codes: [1, 2], label: "Partly cloudy", icon: "⛅️" },
        { codes: [3], label: "Overcast", icon: "☁️" },
        { codes: [45, 48], label: "Fog", icon: "🌫" },
        { codes: [51, 53, 55, 56, 57], label: "Drizzle", icon: "🌦" },
        { codes: [61, 63, 65, 66, 67, 80, 81, 82], label: "Rain", icon: "🌧" },
        { codes: [71, 73, 75, 77, 85, 86], label: "Snow", icon: "❄️" },
        { codes: [95, 96, 99], label: "Thunderstorm", icon: "⛈" }
    ];

    constructor(baseUrl = "https://api.open-meteo.com/v1/forecast", timeoutMs = 8000) {
        this.baseUrl = baseUrl;
        this.timeoutMs = timeoutMs;
    }

    static toDateString(date) {
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return ${date.getFullYear()}-${month}-${day};
    }

    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static getLastForecastDate() {
        return WeatherService.toDateString(WeatherService.addDays(new Date(), WeatherService.MAX_DAYS_AHEAD));
    }

    static getWeatherInfo(code) {
        const type = WeatherService.WEATHER_TYPES.find((item) => item.codes.includes(code));
        return type  { label: "Unknown", icon: "❔" };
    }

    buildUrl(lat, lon, startDate, endDate) {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
            timezone: "auto",
            start_date: startDate,
            end_date: endDate
        });
        return `${this.baseUrl}?${params.toString()}`;
    }

    static parseDaily(data) {
        if (!data  !data.daily || !Array.isArray(data.daily.time)) {
            throw new Error("Unexpected data from the weather service.");
        }

        const daily = data.daily;
        const toNumber = (value) => (typeof value === "number" ? Math.round(value) : null);

        return daily.time.map((date, index) => ({
            date: date,
            code: daily.weather_code ? daily.weather_code[index] : null,
            max: toNumber(daily.temperature_2m_max?.[index]),
            min: toNumber(daily.temperature_2m_min?.[index]),
            rain: toNumber(daily.precipitation_probability_max?.[index])
        }));
    }

    async getForecast(lat, lon, startDate, endDate) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            const response = await fetch(this.buildUrl(lat, lon, startDate, endDate), {
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(Weather server answered with status ${response.status}.);
            }

            const data = await response.json();
            return WeatherService.parseDaily(data);
        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("The weather service took too long to answer.");
            }
            throw error;
        } finally {
            clearTimeout(timer);
        }
    }
}