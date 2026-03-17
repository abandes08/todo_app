Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", async function () {

    const ctx = document.getElementById('todoChart');

    // Initialize empty chart
    let todoChart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        plugins: [ChartDataLabels],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    display: true,
                    color: '#fff',
                    anchor: 'center',
                    align: 'center',
                    font: { weight: 'bold', size: 12 },
                    formatter: (value, context) => {
                        const numbers = context.dataset.data.map(v => Number(v));
                        const total = numbers.reduce((a,b) => a+b,0);
                        const percentage = ((Number(value)/total)*100).toFixed(0);

                        if (window.innerWidth <= 600) return `${percentage}%`;

                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}\n${percentage}%`;
                    }
                }
            }
        }
    });

    // Function to fetch data and update chart
    async function updateChart(search = '', category = '', status = '') {
        try {
            const res = await fetch(`/api/todos/get_todos_stats.php?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}`);
            const result = await res.json();

            if (!result.success) throw new Error("Failed to load stats");

            const labels = result.data.map(item => item.category_name);
            const values = result.data.map(item => Number(item.total));

            // Map colors per category
            const categoryColors = {
                'Personal': '#22c55e',
                'Work': '#3b82f6',
                'Shopping': '#f59e0b',
                'Health': '#ef4444',
                'Hobby': '#8b5cf6'
            };
            const colors = labels.map(label => categoryColors[label] || '#888'); // fallback gray

            // Update chart data
            todoChart.data.labels = labels;
            todoChart.data.datasets[0].data = values;
            todoChart.data.datasets[0].backgroundColor = colors;

            todoChart.update();

        } catch(err) {
            console.error("Chart update error:", err);
        }

    }

    // INITIAL load
    updateChart();

    // Example: hook up to search input and filter selects
    const searchInput = document.getElementById('searchInput'); // your search input
    const categorySelect = document.getElementById('categoryFilter'); // your category dropdown
    const statusSelect = document.getElementById('statusFilter'); // your status dropdown


    // Add event listeners
    [searchInput, categorySelect, statusSelect].forEach(el => {
        el.addEventListener('change', () => {
            updateChart(searchInput.value, categorySelect.value, statusSelect.value);
        });
    });

});