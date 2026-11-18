class StatsPanel {
    constructor(cardsContainer, emptyMessage, chartBox, canvas) {
        this.cardsContainer = cardsContainer;
        this.emptyMessage = emptyMessage;
        this.chartBox = chartBox;
        this.canvas = canvas;
        this.chart = null;
    }

    static calculate(bookings) {
        const stats = bookings.reduce((result, booking) => {
            result.count += 1;
            result.nights += booking.getNights();
            result.total += booking.getTotal();
            return result;
        }, { count: 0, nights: 0, total: 0 });

        stats.averageNight = stats.nights > 0 ? Math.round(stats.total / stats.nights) : 0;
        return stats;
    }

    static getTotalsByCity(bookings) {
        const totals = {};
        for (const booking of bookings) {
            const city = booking.getHotel().city;
            totals[city] = (totals[city] || 0) + booking.getTotal();
        }
        return totals;
    }

    static getTopCity(totals) {
        const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
        return entries.length > 0 ? entries[0][0] : "—";
    }

    createCard(label, value) {
        const card = document.createElement("div");
        card.className = "stat-card";
        card.innerHTML = `<span class="stat-label">${label}</span><strong class="stat-value">${value}</strong>`;
        return card;
    }

    renderCards(stats, topCity) {
        this.cardsContainer.innerHTML = "";

        const cards = [
            ["Bookings", stats.count],
            ["Nights", stats.nights],
            ["Total spent", `$${stats.total}`],
            ["Average per night", `$${stats.averageNight}`],
            ["Top city", topCity]
        ];

        cards.forEach(([label, value]) => {
            this.cardsContainer.appendChild(this.createCard(label, value));
        });
    }

    renderChart(totals) {
        if (typeof Chart === "undefined") {
            this.chartBox.innerHTML = '<p class="muted">The chart could not be loaded. Check your internet connection.</p>';
            return;
        }

        if (this.chart) {
            this.chart.destroy();
        }

        const textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();

        this.chart = new Chart(this.canvas, {
            type: "bar",
            data: {
                labels: Object.keys(totals),
                datasets: [{
                    label: "Total spent ($)",
                    data: Object.values(totals),
                    backgroundColor: "#5a8dee"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor } },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor, callback: (value) => `$${value}` }
                    }
                }
            }
        });
    }

    update(bookings) {
        if (bookings.length === 0) {
            this.cardsContainer.innerHTML = "";
            this.emptyMessage.classList.remove("hidden");
            this.chartBox.classList.add("hidden");
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            return;
        }

        const stats = StatsPanel.calculate(bookings);
        const totals = StatsPanel.getTotalsByCity(bookings);

        this.emptyMessage.classList.add("hidden");
        this.chartBox.classList.remove("hidden");
        this.renderCards(stats, StatsPanel.getTopCity(totals));
        this.renderChart(totals);
    }
}