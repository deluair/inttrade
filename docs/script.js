// Data generation utilities
function generateMonthlyData(startDate, endDate) {
    const dates = [];
    const exports = [];
    const imports = [];
    const baseExport = 100;
    const baseImport = 90;
    
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    // Add seasonal and trend components
    let trend = 0;
    let i = 0;
    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        
        // Add trend
        trend = i * 0.5;
        
        // Add seasonal component
        const seasonal = Math.sin(i * Math.PI / 6) * 15; // 12-month cycle
        
        // Add random component
        const randomExport = Math.random() * 20 - 10;
        const randomImport = Math.random() * 20 - 10;
        
        exports.push(baseExport + trend + seasonal + randomExport);
        imports.push(baseImport + trend + seasonal + randomImport);
        
        currentDate.setMonth(currentDate.getMonth() + 1);
        i++;
    }
    
    return { dates, exports, imports };
}

function calculateYoYGrowth(values) {
    if (values.length < 13) return 0;
    const currentValue = values[values.length - 1];
    const previousValue = values[values.length - 13];
    return ((currentValue - previousValue) / previousValue) * 100;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value * 1000000); // Convert to millions
}

// Chart update functions
function updateTradeBalanceChart(data) {
    const showTrend = document.getElementById('show-trend').checked;
    
    const traces = [
        {
            x: data.dates,
            y: data.exports,
            name: 'Exports',
            type: 'scatter',
            line: { color: '#2ecc71' }
        },
        {
            x: data.dates,
            y: data.imports,
            name: 'Imports',
            type: 'scatter',
            line: { color: '#e74c3c' }
        }
    ];
    
    if (showTrend) {
        // Add trend lines
        const exportTrend = data.exports.map((_, i) => {
            return data.exports.reduce((a, b) => a + b) / data.exports.length;
        });
        
        const importTrend = data.imports.map((_, i) => {
            return data.imports.reduce((a, b) => a + b) / data.imports.length;
        });
        
        traces.push({
            x: data.dates,
            y: exportTrend,
            name: 'Export Trend',
            line: { dash: 'dot', color: '#27ae60' },
            opacity: 0.7
        });
        
        traces.push({
            x: data.dates,
            y: importTrend,
            name: 'Import Trend',
            line: { dash: 'dot', color: '#c0392b' },
            opacity: 0.7
        });
    }
    
    const layout = {
        title: `Trade Balance for ${document.getElementById('country-selector').value}`,
        xaxis: { title: 'Date' },
        yaxis: { title: 'Value (USD Millions)' },
        hovermode: 'x unified',
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.2
        }
    };
    
    Plotly.newPlot('trade-balance-chart', traces, layout);
}

function updateCompositionCharts() {
    // Export Composition
    const exportComposition = {
        values: [30, 20, 15, 10, 25],
        labels: ['Manufacturing', 'Agriculture', 'Technology', 'Services', 'Other'],
        type: 'pie',
        name: 'Exports',
        marker: {
            colors: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#95a5a6']
        }
    };
    
    const exportLayout = {
        title: 'Export Composition',
        height: 400,
        showlegend: true
    };
    
    Plotly.newPlot('export-composition', [exportComposition], exportLayout);
    
    // Import Composition
    const importComposition = {
        values: [35, 15, 20, 10, 20],
        labels: ['Raw Materials', 'Consumer Goods', 'Technology', 'Energy', 'Other'],
        type: 'pie',
        name: 'Imports',
        marker: {
            colors: ['#e74c3c', '#f39c12', '#16a085', '#2980b9', '#7f8c8d']
        }
    };
    
    const importLayout = {
        title: 'Import Composition',
        height: 400,
        showlegend: true
    };
    
    Plotly.newPlot('import-composition', [importComposition], importLayout);
}

function updateTradingPartnersChart() {
    const data = {
        type: 'sankey',
        node: {
            pad: 15,
            thickness: 30,
            line: { color: 'black', width: 0.5 },
            label: ['Source', 'USA', 'China', 'EU', 'Japan', 'Other'],
            color: ['#2c3e50', '#2ecc71', '#e74c3c', '#3498db', '#f1c40f', '#95a5a6']
        },
        link: {
            source: [0, 0, 0, 0, 0],
            target: [1, 2, 3, 4, 5],
            value: [20, 15, 25, 10, 30],
            color: ['rgba(46, 204, 113, 0.4)', 'rgba(231, 76, 60, 0.4)', 
                   'rgba(52, 152, 219, 0.4)', 'rgba(241, 196, 15, 0.4)', 
                   'rgba(149, 165, 166, 0.4)']
        }
    };

    const layout = {
        title: 'Trading Partners Network',
        font: { size: 12 }
    };

    Plotly.newPlot('trading-partners-chart', [data], layout);
}

function updateTopExportsChart() {
    const data = [{
        type: 'bar',
        x: ['Electronics', 'Automobiles', 'Machinery', 'Chemicals', 'Food'],
        y: [65, 45, 35, 25, 20],
        marker: {
            color: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#95a5a6']
        }
    }];

    const layout = {
        title: 'Top Export Categories',
        xaxis: { title: 'Category' },
        yaxis: { title: 'Export Value (USD Billions)' }
    };

    Plotly.newPlot('top-exports-chart', data, layout);
}

function updateGrowthAnalysisChart(data) {
    if (!document.getElementById('show-yoy').checked) return;
    
    const yoyExports = [];
    const yoyImports = [];
    const dates = [];
    
    // Calculate year-over-year growth rates
    for (let i = 12; i < data.exports.length; i++) {
        const exportGrowth = ((data.exports[i] - data.exports[i-12]) / data.exports[i-12]) * 100;
        const importGrowth = ((data.imports[i] - data.imports[i-12]) / data.imports[i-12]) * 100;
        
        yoyExports.push(exportGrowth);
        yoyImports.push(importGrowth);
        dates.push(data.dates[i]);
    }
    
    const traces = [
        {
            x: dates,
            y: yoyExports,
            name: 'Export Growth',
            type: 'scatter',
            line: { color: '#2ecc71' }
        },
        {
            x: dates,
            y: yoyImports,
            name: 'Import Growth',
            type: 'scatter',
            line: { color: '#e74c3c' }
        }
    ];
    
    const layout = {
        title: 'Year-over-Year Growth Rates',
        xaxis: { title: 'Date' },
        yaxis: { 
            title: 'Growth Rate (%)',
            zeroline: true
        },
        showlegend: true
    };
    
    Plotly.newPlot('growth-analysis-chart', traces, layout);
}

function updateMetrics(data) {
    const lastExport = data.exports[data.exports.length - 1];
    const lastImport = data.imports[data.imports.length - 1];
    const tradeBalance = lastExport - lastImport;
    const totalTrade = lastExport + lastImport;
    
    document.getElementById('total-trade').querySelector('.metric-value').textContent = 
        formatCurrency(totalTrade);
    
    const tradeBalanceElement = document.getElementById('trade-balance').querySelector('.metric-value');
    tradeBalanceElement.textContent = formatCurrency(Math.abs(tradeBalance));
    tradeBalanceElement.style.color = tradeBalance >= 0 ? '#2ecc71' : '#e74c3c';
    
    const yoyGrowth = calculateYoYGrowth(data.exports);
    const yoyElement = document.getElementById('yoy-growth').querySelector('.metric-value');
    yoyElement.textContent = `${yoyGrowth.toFixed(1)}%`;
    yoyElement.style.color = yoyGrowth >= 0 ? '#2ecc71' : '#e74c3c';
}

// Main update function
function updateDashboard() {
    const country = document.getElementById('country-selector').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    const data = generateMonthlyData(startDate, endDate);
    
    updateTradeBalanceChart(data);
    updateCompositionCharts();
    updateTradingPartnersChart();
    updateTopExportsChart();
    updateGrowthAnalysisChart(data);
    updateMetrics(data);
}

// Event listeners
document.getElementById('country-selector').addEventListener('change', updateDashboard);
document.getElementById('start-date').addEventListener('change', updateDashboard);
document.getElementById('end-date').addEventListener('change', updateDashboard);
document.getElementById('show-trend').addEventListener('change', updateDashboard);
document.getElementById('show-yoy').addEventListener('change', updateDashboard);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', updateDashboard);
