document.addEventListener("DOMContentLoaded", function () {

    const ctx = document.getElementById('todoChart');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Personal',
                'Work',
                'Shopping',
                'Health',
                'Hobby'
            ],
            datasets: [{
                data: [20, 25, 15, 25, 15],
                backgroundColor: [
                    '#22c55e',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ]
            }]
        },
        plugins: [ChartDataLabels],

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: 'bottom'
                },

                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: (value, context) => {
                        let label = context.chart.data.labels[context.dataIndex];
                        return label + "\n" + value + "%";
                    }
                }

            }
        }
    });

});