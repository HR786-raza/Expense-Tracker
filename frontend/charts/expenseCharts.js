let monthlyChart;
let yearlyChart;

function updateCharts(expenses) {
    const monthly = {};
    const yearly = {};

    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        monthly[month] = (monthly[month] || 0) + parseFloat(exp.amount);
        yearly[year] = (yearly[year] || 0) + parseFloat(exp.amount);
    });

    const monthLabels = Object.keys(monthly);
    const monthValues = Object.values(monthly);
    const yearLabels = Object.keys(yearly);
    const yearValues = Object.values(yearly);

    if (monthlyChart) monthlyChart.destroy();
    if (yearlyChart) yearlyChart.destroy();

    const ctx1 = document.getElementById('monthlyChart').getContext('2d');
    monthlyChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthValues,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        }
    });

    const ctx2 = document.getElementById('yearlyChart').getContext('2d');
    yearlyChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: yearLabels,
            datasets: [{
                label: 'Yearly Expenses',
                data: yearValues,
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        }
    });
}