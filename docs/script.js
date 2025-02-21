// Sample data generator
function generateTradeData(startDate, endDate) {
    const dates = [];
    const exports = [];
    const imports = [];
    
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        exports.push(Math.random() * 100 + 50); // Random export values
        imports.push(Math.random() * 80 + 40);  // Random import values
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return { dates, exports, imports };
}

// Update charts
function updateCharts() {
    const country = document.getElementById('country-selector').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    const data = generateTradeData(startDate, endDate);
    
    // Trade Balance Chart
    const tradeBalanceTrace1 = {
        x: data.dates,
        y: data.exports,
        name: 'Exports',
        type: 'scatter',
        line: { color: '#2ecc71' }
    };
    
    const tradeBalanceTrace2 = {
        x: data.dates,
        y: data.imports,
        name: 'Imports',
        type: 'scatter',
        line: { color: '#e74c3c' }
    };
    
    const tradeBalanceLayout = {
        title: `Trade Balance for ${country}`,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Value (USD Millions)' },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('trade-balance-chart', [tradeBalanceTrace1, tradeBalanceTrace2], tradeBalanceLayout);
    
    // Export Composition
    const exportComposition = {
        values: [30, 20, 15, 10, 25],
        labels: ['Manufacturing', 'Agriculture', 'Technology', 'Services', 'Other'],
        type: 'pie',
        name: 'Exports'
    };
    
    const exportLayout = {
        title: 'Export Composition'
    };
    
    Plotly.newPlot('export-composition', [exportComposition], exportLayout);
    
    // Import Composition
    const importComposition = {
        values: [35, 15, 20, 10, 20],
        labels: ['Raw Materials', 'Consumer Goods', 'Technology', 'Energy', 'Other'],
        type: 'pie',
        name: 'Imports'
    };
    
    const importLayout = {
        title: 'Import Composition'
    };
    
    Plotly.newPlot('import-composition', [importComposition], importLayout);
}

// Event listeners
document.getElementById('country-selector').addEventListener('change', updateCharts);
document.getElementById('start-date').addEventListener('change', updateCharts);
document.getElementById('end-date').addEventListener('change', updateCharts);

// Initial load
document.addEventListener('DOMContentLoaded', updateCharts);
