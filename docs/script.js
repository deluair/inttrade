// Country-specific trade data (2023 estimates in billions USD)
const countryData = {
    'CHN': { // China
        baseExport: 3500,
        baseImport: 2800,
        topExports: ['Electronics', 'Machinery', 'Textiles', 'Vehicles', 'Metals'],
        topExportValues: [850, 650, 450, 350, 250],
        tradingPartners: ['USA', 'EU', 'ASEAN', 'Japan', 'South Korea'],
        partnerValues: [500, 450, 350, 300, 250]
    },
    'USA': { // United States
        baseExport: 3000,
        baseImport: 3200,
        topExports: ['Machinery', 'Electronics', 'Aircraft', 'Vehicles', 'Pharmaceuticals'],
        topExportValues: [700, 600, 500, 400, 300],
        tradingPartners: ['Canada', 'Mexico', 'China', 'Japan', 'Germany'],
        partnerValues: [450, 400, 350, 250, 200]
    },
    'DEU': { // Germany
        baseExport: 1800,
        baseImport: 1500,
        topExports: ['Vehicles', 'Machinery', 'Pharmaceuticals', 'Electronics', 'Chemical'],
        topExportValues: [450, 350, 250, 200, 150],
        tradingPartners: ['USA', 'France', 'China', 'Netherlands', 'UK'],
        partnerValues: [300, 250, 200, 150, 100]
    },
    'JPN': { // Japan
        baseExport: 1500,
        baseImport: 1400,
        topExports: ['Vehicles', 'Electronics', 'Machinery', 'Steel', 'Chemicals'],
        topExportValues: [400, 300, 250, 150, 100],
        tradingPartners: ['China', 'USA', 'South Korea', 'Taiwan', 'Thailand'],
        partnerValues: [250, 200, 150, 100, 50]
    },
    'NLD': { // Netherlands
        baseExport: 800,
        baseImport: 750,
        topExports: ['Machinery', 'Chemicals', 'Food', 'Electronics', 'Oil Products'],
        topExportValues: [200, 150, 120, 100, 80],
        tradingPartners: ['Germany', 'Belgium', 'UK', 'France', 'USA'],
        partnerValues: [150, 120, 100, 80, 50]
    },
    'KOR': { // South Korea
        baseExport: 700,
        baseImport: 650,
        topExports: ['Electronics', 'Vehicles', 'Steel', 'Ships', 'Plastics'],
        topExportValues: [180, 150, 120, 100, 80],
        tradingPartners: ['China', 'USA', 'Japan', 'Vietnam', 'Hong Kong'],
        partnerValues: [140, 120, 100, 80, 60]
    },
    'ITA': { // Italy
        baseExport: 650,
        baseImport: 600,
        topExports: ['Machinery', 'Fashion', 'Vehicles', 'Pharmaceuticals', 'Food'],
        topExportValues: [160, 130, 110, 90, 70],
        tradingPartners: ['Germany', 'France', 'USA', 'Spain', 'UK'],
        partnerValues: [120, 100, 80, 60, 40]
    },
    'FRA': { // France
        baseExport: 600,
        baseImport: 650,
        topExports: ['Aircraft', 'Machinery', 'Luxury Goods', 'Electronics', 'Pharmaceuticals'],
        topExportValues: [150, 120, 100, 80, 60],
        tradingPartners: ['Germany', 'USA', 'Italy', 'Spain', 'Belgium'],
        partnerValues: [110, 90, 70, 50, 30]
    },
    'HKG': { // Hong Kong
        baseExport: 550,
        baseImport: 600,
        topExports: ['Electronics', 'Precious Stones', 'Machinery', 'Textiles', 'Watches'],
        topExportValues: [140, 110, 90, 70, 50],
        tradingPartners: ['China', 'USA', 'Japan', 'Taiwan', 'Singapore'],
        partnerValues: [100, 80, 60, 40, 20]
    },
    'GBR': { // United Kingdom
        baseExport: 500,
        baseImport: 550,
        topExports: ['Machinery', 'Vehicles', 'Pharmaceuticals', 'Oil', 'Aircraft'],
        topExportValues: [130, 100, 80, 60, 40],
        tradingPartners: ['USA', 'Germany', 'Netherlands', 'France', 'Ireland'],
        partnerValues: [90, 70, 50, 30, 20]
    }
};

// Data generation utilities
function generateMonthlyData(startDate, endDate, country) {
    // Input validation
    if (!startDate || !endDate || !country || !countryData[country]) {
        console.error('Invalid input parameters for data generation');
        return null;
    }

    const dates = [];
    const exports = [];
    const imports = [];
    const countryInfo = countryData[country];
    const baseExport = countryInfo.baseExport;
    const baseImport = countryInfo.baseImport;
    
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate date range
    if (currentDate > end) {
        console.error('Start date must be before end date');
        return null;
    }
    
    // Add seasonal and trend components
    let trend = 0;
    let i = 0;
    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        
        // Enhanced trend calculation (variable growth rate based on country)
        const annualGrowthRate = (country === 'CHN' || country === 'USA') ? 0.025 : 0.02;
        trend = i * (baseExport * annualGrowthRate / 12);
        
        // Improved seasonal component with country-specific patterns
        const seasonalFactor = Math.sin(i * Math.PI / 6) * (baseExport * 0.1);
        const countrySeasonality = getCountrySeasonality(country, currentDate.getMonth());
        const seasonal = seasonalFactor * countrySeasonality;
        
        // Enhanced random component with controlled volatility
        const volatility = getCountryVolatility(country);
        const randomExport = (Math.random() - 0.5) * (baseExport * volatility);
        const randomImport = (Math.random() - 0.5) * (baseImport * volatility);
        
        exports.push((baseExport + trend + seasonal + randomExport) / 12);
        imports.push((baseImport + trend + seasonal + randomImport) / 12);
        
        currentDate.setMonth(currentDate.getMonth() + 1);
        i++;
    }
    
    return { dates, exports, imports };
}

// Helper function for country-specific seasonality
function getCountrySeasonality(country, month) {
    const seasonalityPatterns = {
        'CHN': [1.1, 0.8, 1.0, 1.0, 1.1, 1.2, 1.1, 1.0, 1.2, 1.1, 1.2, 1.0], // Chinese New Year effect
        'USA': [0.8, 0.9, 1.0, 1.1, 1.1, 1.2, 1.0, 1.0, 1.1, 1.2, 1.2, 1.3], // Holiday season effect
        'default': [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
    };
    return (seasonalityPatterns[country] || seasonalityPatterns.default)[month];
}

// Helper function for country-specific volatility
function getCountryVolatility(country) {
    const volatilities = {
        'HKG': 0.08, // Higher volatility for financial hub
        'GBR': 0.07, // Brexit effect
        'default': 0.05
    };
    return volatilities[country] || volatilities.default;
}

function calculateYoYGrowth(values) {
    if (!Array.isArray(values) || values.length < 13) {
        return { growth: 0, isEstimate: true };
    }
    
    const currentValue = values[values.length - 1];
    const previousValue = values[values.length - 13];
    
    if (previousValue === 0) return { growth: 0, isEstimate: true };
    
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    return {
        growth: parseFloat(growth.toFixed(2)),
        isEstimate: false
    };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// Chart update functions
function updateTradeBalanceChart(data, country) {
    if (!data || !data.dates || !data.exports || !data.imports) {
        console.error('Invalid data for trade balance chart');
        return;
    }

    const showTrend = document.getElementById('show-trend').checked;
    
    // Calculate trade balance
    const tradeBalance = data.exports.map((exp, i) => exp - data.imports[i]);
    
    const traces = [
        {
            x: data.dates,
            y: data.exports,
            name: 'Exports',
            type: 'scatter',
            line: { color: '#2ecc71' },
            hovertemplate: '%{y:$.2f}B<br>Date: %{x|%b %Y}<extra></extra>'
        },
        {
            x: data.dates,
            y: data.imports,
            name: 'Imports',
            type: 'scatter',
            line: { color: '#e74c3c' },
            hovertemplate: '%{y:$.2f}B<br>Date: %{x|%b %Y}<extra></extra>'
        },
        {
            x: data.dates,
            y: tradeBalance,
            name: 'Trade Balance',
            type: 'scatter',
            line: { color: '#3498db', dash: 'dash' },
            hovertemplate: '%{y:$.2f}B<br>Date: %{x|%b %Y}<extra></extra>'
        }
    ];
    
    if (showTrend) {
        // Enhanced trend calculation using exponential moving average
        const alpha = 0.2; // Smoothing factor
        const exportTrend = calculateEMA(data.exports, alpha);
        const importTrend = calculateEMA(data.imports, alpha);
        
        traces.push({
            x: data.dates,
            y: exportTrend,
            name: 'Export Trend (EMA)',
            line: { dash: 'dot', color: '#27ae60' },
            opacity: 0.7,
            hovertemplate: '%{y:$.2f}B<br>Date: %{x|%b %Y}<extra></extra>'
        });
        
        traces.push({
            x: data.dates,
            y: importTrend,
            name: 'Import Trend (EMA)',
            line: { dash: 'dot', color: '#c0392b' },
            opacity: 0.7,
            hovertemplate: '%{y:$.2f}B<br>Date: %{x|%b %Y}<extra></extra>'
        });
    }
    
    const layout = {
        title: {
            text: `Monthly Trade Balance for ${getCountryName(country)}`,
            font: { size: 24 }
        },
        xaxis: { 
            title: 'Date',
            tickformat: '%b %Y'
        },
        yaxis: { 
            title: 'Value (USD Billions)',
            tickformat: '$.1f'
        },
        hovermode: 'x unified',
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.2
        }
    };
    
    Plotly.newPlot('trade-balance-chart', traces, layout);
}

// Helper function for exponential moving average
function calculateEMA(data, alpha) {
    let ema = [data[0]];
    for (let i = 1; i < data.length; i++) {
        ema.push(alpha * data[i] + (1 - alpha) * ema[i-1]);
    }
    return ema;
}

// Helper function to get full country name
function getCountryName(code) {
    const countryNames = {
        'CHN': 'China',
        'USA': 'United States',
        'DEU': 'Germany',
        'JPN': 'Japan',
        'NLD': 'Netherlands',
        'KOR': 'South Korea',
        'ITA': 'Italy',
        'FRA': 'France',
        'HKG': 'Hong Kong',
        'GBR': 'United Kingdom'
    };
    return countryNames[code] || code;
}

function updateCompositionCharts(country) {
    const countryInfo = countryData[country];
    
    // Export Composition
    const exportComposition = {
        values: countryInfo.topExportValues,
        labels: countryInfo.topExports,
        type: 'pie',
        name: 'Exports',
        marker: {
            colors: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#95a5a6']
        }
    };
    
    const exportLayout = {
        title: 'Export Composition by Category',
        height: 400,
        showlegend: true
    };
    
    Plotly.newPlot('export-composition', [exportComposition], exportLayout);
    
    // Trading Partners
    const importComposition = {
        values: countryInfo.partnerValues,
        labels: countryInfo.tradingPartners,
        type: 'pie',
        name: 'Trading Partners',
        marker: {
            colors: ['#e74c3c', '#f39c12', '#16a085', '#2980b9', '#7f8c8d']
        }
    };
    
    const importLayout = {
        title: 'Top Trading Partners',
        height: 400,
        showlegend: true
    };
    
    Plotly.newPlot('import-composition', [importComposition], importLayout);
}

function updateTradingPartnersChart(country) {
    const countryInfo = countryData[country];
    
    const data = {
        type: 'sankey',
        node: {
            pad: 15,
            thickness: 30,
            line: { color: 'black', width: 0.5 },
            label: [country, ...countryInfo.tradingPartners],
            color: ['#2c3e50', '#2ecc71', '#e74c3c', '#3498db', '#f1c40f', '#95a5a6']
        },
        link: {
            source: Array(5).fill(0),
            target: [1, 2, 3, 4, 5],
            value: countryInfo.partnerValues,
            color: Array(5).fill('rgba(127, 140, 141, 0.4)')
        }
    };

    const layout = {
        title: `Trade Network: ${country}`,
        font: { size: 12 }
    };

    Plotly.newPlot('trading-partners-chart', [data], layout);
}

function updateTopExportsChart(country) {
    const countryInfo = countryData[country];
    
    const data = [{
        type: 'bar',
        x: countryInfo.topExports,
        y: countryInfo.topExportValues,
        marker: {
            color: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#95a5a6']
        }
    }];

    const layout = {
        title: `Top Export Categories: ${country}`,
        xaxis: { title: 'Category' },
        yaxis: { 
            title: 'Export Value (USD Billions)',
            tickformat: '$.0f'
        }
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
            zeroline: true,
            tickformat: '.1f'
        },
        showlegend: true
    };
    
    Plotly.newPlot('growth-analysis-chart', traces, layout);
}

function updateMetrics(data, country) {
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
    yoyElement.textContent = `${yoyGrowth.growth}%`;
    yoyElement.style.color = yoyGrowth.growth >= 0 ? '#2ecc71' : '#e74c3c';
}

// Main update function
function updateDashboard() {
    const country = document.getElementById('country-selector').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    const data = generateMonthlyData(startDate, endDate, country);
    
    updateTradeBalanceChart(data, country);
    updateCompositionCharts(country);
    updateTradingPartnersChart(country);
    updateTopExportsChart(country);
    updateGrowthAnalysisChart(data);
    updateMetrics(data, country);
}

// Event listeners
document.getElementById('country-selector').addEventListener('change', updateDashboard);
document.getElementById('start-date').addEventListener('change', updateDashboard);
document.getElementById('end-date').addEventListener('change', updateDashboard);
document.getElementById('show-trend').addEventListener('change', updateDashboard);
document.getElementById('show-yoy').addEventListener('change', updateDashboard);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', updateDashboard);
