const statsPanel = new StatsPanel(
    document.getElementById("stats-cards"),
    document.getElementById("stats-empty"),
    document.getElementById("chart-box"),
    document.getElementById("city-chart")
);

document.addEventListener("DOMContentLoaded", () => {
    statsPanel.update(loadBookings());
});

window.addEventListener("storage", (event) => {
    if (event.key === bookingsStorage.key) {
        statsPanel.update(loadBookings());
    }
});