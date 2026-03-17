Chart.register(ChartDataLabels);

document.addEventListener("DOMContentLoaded", async function () {
    const statusCanvas = document.getElementById('statusChart');
    const categoryCanvas = document.getElementById('categoryChart');

    // Filters & search elements
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categoryFilter');
    const statusSelect = document.getElementById('statusFilter');

    // === Initialize empty charts ===
    let statusChart = new Chart(statusCanvas, {
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
                    font: { weight: 'bold', size: 10 },

                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a,b)=>a+Number(b),0);
                        const label = context.chart.data.labels[context.dataIndex];
                        const statusFilter = statusSelect.value;

                        if (!statusFilter) {
                            // No status filter => show percentage
                            const percent = total > 0 ? ((value/total)*100).toFixed(0) : 0;
                            if (window.innerWidth <= 600) return `${percent}%`;
                            return `${wrapText(label, 10)}\n${percent}%`;
                        } else {
                            // Status filter applied => show number only
                            if (value === 0) return '';
                            // Wrap label if needed
                            return `${value}\n${wrapText(label, 10)}`;
                        }
                    }
                }
            }
        }
    });

    // === Initialize empty charts ===
    let categoryChart = new Chart(categoryCanvas, {
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
                    font: { weight: 'bold', size: 10 },
                    formatter: (value, context) => {
                        const label = context.chart.data.labels[context.dataIndex];
                        const total = context.dataset.data.reduce((a,b)=>a+Number(b),0);

                        const categoryFilterApplied = categorySelect.value !== '';
                        const statusFilterApplied = statusSelect.value !== '';

                        // If any filter is applied (category or status), show number of tasks
                        if (categoryFilterApplied || statusFilterApplied) {
                            if (value === 0) return '';
                            return `${value} ${wrapText(label, 10)} Tasks`;
                        }

                        // Otherwise, show percentage
                        const percent = total > 0 ? ((value/total)*100).toFixed(0) : 0;
                        if (window.innerWidth <= 600) return `${percent}%`;
                        return `${wrapText(label, 10)}\n${percent}%`;
                    }
                }
            }
        }
    });

    //Helper function to wrapText
    function wrapText(text, maxChars = 10) {
        if (!text) return '';
        const words = text.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length > maxChars) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });

        lines.push(currentLine.trim());
        return lines.join('\n');
    }

    // === Fetch and update Status Chart ===
    async function updateStatusChart(search='', category='', status='') {
        try {
            const res = await fetch(`/api/todos/get_todos_stxstats.php?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}`);
            const result = await res.json();
            if (!result.success) throw new Error("Failed to load status stats");

            const labels = result.data.map(item => item.status_name);
            const values = result.data.map(item => Number(item.total));

            const statusColors = {
                'Created': '#3b82f6',
                'In Progress': '#facc15',
                'Completed': '#22c55e',
                'Cancelled': '#ef4444',
                'On-Hold': '#6b7280'
            };
            const colors = labels.map(label => statusColors[label] || '#888');

            statusChart.data.labels = labels;
            statusChart.data.datasets[0].data = values;
            statusChart.data.datasets[0].backgroundColor = colors;

            statusChart.update();
        } catch(err) {
            console.error("Status chart error:", err);
        }
    }

    // === Fetch and update Category Chart ===
    async function updateCategoryChart(search='', category='', status='') {
        try {
            const res = await fetch(`/api/todos/get_todos_ctxstats.php?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&status=${encodeURIComponent(status)}`);
            const result = await res.json();
            if (!result.success) throw new Error("Failed to load category stats");

            const labels = result.data.map(item => item.category_name);
            const values = result.data.map(item => Number(item.total));

            const categoryColors = {
                'Personal': '#22c55e',
                'Work': '#3b82f6',
                'Shopping': '#f59e0b',
                'Health': '#ef4444',
                'Hobby': '#8b5cf6'
            };
            const colors = labels.map(label => categoryColors[label] || '#888');

            categoryChart.data.labels = labels;
            categoryChart.data.datasets[0].data = values;
            categoryChart.data.datasets[0].backgroundColor = colors;

            categoryChart.update();
        } catch(err) {
            console.error("Category chart error:", err);
        }
    }

    // === Refresh charts based on filters/search ===
    let searchTimeout;

    function refreshCharts() {
        const search = searchInput.value.trim();
        const category = categorySelect.value;
        const status = statusSelect.value;

        updateCategoryChart(search, category, status); // Always update based on both filters
        updateStatusChart(search, category, status);   // Always update based on both filters
    }

    // Debounce search input to reduce rapid API calls
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(refreshCharts, 300); // wait 300ms after typing stops
    });

    // === Event listeners ===
    // searchInput.addEventListener('input', refreshCharts);
    categorySelect.addEventListener('change', refreshCharts);
    statusSelect.addEventListener('change', refreshCharts);

    // === Initial load ===
    refreshCharts();
});