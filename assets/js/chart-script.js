Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", () => {

    const statusCanvas = document.getElementById('statusChart');
    const categoryCanvas = document.getElementById('categoryChart');

    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categoryFilter');
    const statusSelect = document.getElementById('statusFilter');

    let statusChart, categoryChart;

    // =========================
    // INIT CHARTS
    // =========================
    function initCharts() {

        statusChart = new Chart(statusCanvas, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            plugins: [ChartDataLabels],
            options: getChartOptions()
        });

        categoryChart = new Chart(categoryCanvas, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            plugins: [ChartDataLabels],
            options: getChartOptions()
        });
    }

    // =========================
    // SHARED OPTIONS
    // =========================
    function getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold', size: 10 },
                    formatter: (value, context) => {

                        const total = context.dataset.data.reduce((a, b) => a + Number(b), 0);
                        const label = context.chart.data.labels[context.dataIndex];

                        const isFiltered =
                            searchInput.value ||
                            categorySelect.value ||
                            statusSelect.value;

                        // % if no filters
                        if (!isFiltered) {
                            const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                            return window.innerWidth <= 600
                                ? `${percent}%`
                                : `${wrapText(label)}\n${percent}%`;
                        }

                        // count if filtered
                        if (value === 0) return '';
                        return `${value}\n${wrapText(label)}`;
                    }
                }
            }
        };
    }

    // =========================
    // TEXT WRAP
    // =========================
    function wrapText(text, maxChars = 10) {
        if (!text) return '';
        const words = text.split(' ');
        let lines = [];
        let current = '';

        words.forEach(word => {
            if ((current + word).length > maxChars) {
                lines.push(current.trim());
                current = word + ' ';
            } else {
                current += word + ' ';
            }
        });

        lines.push(current.trim());
        return lines.join('\n');
    }

    // =========================
    // UPDATE CHARTS (CORE LOGIC)
    // =========================
    window.updateCharts = function (filteredTodos = []) {

        // =========================
        // STATUS DATA
        // =========================
        const statusCounts = {};

        filteredTodos.forEach(t => {
            const key = t.status || "Unknown";
            statusCounts[key] = (statusCounts[key] || 0) + 1;
        });

        const statusLabels = Object.keys(statusCounts);
        const statusValues = Object.values(statusCounts);

        const statusColors = {
            'Created': '#3b82f6',
            'In Progress': '#facc15',
            'Completed': '#22c55e',
            'Cancelled': '#ef4444',
            'On-Hold': '#6b7280'
        };

        statusChart.data.labels = statusLabels;
        statusChart.data.datasets[0].data = statusValues;
        statusChart.data.datasets[0].backgroundColor =
            statusLabels.map(l => statusColors[l] || '#888');

        statusChart.update();


        // =========================
        // CATEGORY DATA
        // =========================
        const categoryCounts = {};

        filteredTodos.forEach(t => {
            const key = t.category || "Unknown";
            categoryCounts[key] = (categoryCounts[key] || 0) + 1;
        });

        const categoryLabels = Object.keys(categoryCounts);
        const categoryValues = Object.values(categoryCounts);

        const categoryColors = {
            'Personal': '#22c55e',
            'Work': '#3b82f6',
            'Shopping': '#f59e0b',
            'Health': '#ef4444',
            'Hobby': '#8b5cf6'
        };

        categoryChart.data.labels = categoryLabels;
        categoryChart.data.datasets[0].data = categoryValues;
        categoryChart.data.datasets[0].backgroundColor =
            categoryLabels.map(l => categoryColors[l] || '#888');

        categoryChart.update();
    };

    // =========================
    // INIT
    // =========================
    initCharts();
});