/* =================================
   UYIRNILAM AI - CHARTS CONFIG
   Chart.js configurations
   ================================= */

// Global Chart.js defaults
Chart.defaults.color = '#b6f1c2';
Chart.defaults.borderColor = 'rgba(124, 255, 178, 0.1)';
Chart.defaults.font.family = "'Segoe UI', 'Inter', 'Arial', sans-serif";

// Custom chart colors
const chartColors = {
    primary: '#00ff9c',
    secondary: '#7CFFB2',
    water: '#00bfff',
    profit: '#FFD700',
    time: '#C0C0C0',
    success: '#00ff9c',
    warning: '#FFA500',
    danger: '#ff6b6b'
};

// Create gradient for charts
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Bar chart configuration
function createBarChart(canvasId, labels, data, label, color = chartColors.primary) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                borderRadius: 8,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#b6f1c2',
                        font: {
                            size: 14,
                            weight: 600
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#7CFFB2',
                    bodyColor: '#b6f1c2',
                    borderColor: 'rgba(124, 255, 178, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b6f1c2',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(124, 255, 178, 0.1)',
                        lineWidth: 1
                    }
                },
                x: {
                    ticks: {
                        color: '#b6f1c2',
                        font: {
                            size: 12,
                            weight: 600
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Line chart configuration
function createLineChart(canvasId, labels, datasets, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const gradientGreen = createGradient(ctx, 'rgba(0, 255, 156, 0.5)', 'rgba(0, 255, 156, 0.1)');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                borderColor: [chartColors.primary, chartColors.water, chartColors.profit][index],
                backgroundColor: gradientGreen,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 2
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#7CFFB2',
                    font: {
                        size: 18,
                        weight: 700
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#b6f1c2',
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b6f1c2'
                    },
                    grid: {
                        color: 'rgba(124, 255, 178, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#b6f1c2'
                    },
                    grid: {
                        color: 'rgba(124, 255, 178, 0.05)'
                    }
                }
            }
        }
    });
}

// Pie/Doughnut chart configuration
function createPieChart(canvasId, labels, data, title, type = 'doughnut') {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const colors = [
        chartColors.primary,
        chartColors.water,
        chartColors.profit,
        chartColors.warning,
        chartColors.secondary
    ];
    
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#02140d',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#7CFFB2',
                    font: {
                        size: 18,
                        weight: 700
                    },
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#b6f1c2',
                        padding: 15,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#7CFFB2',
                    bodyColor: '#b6f1c2',
                    padding: 12,
                    cornerRadius: 8
                }
            }
        }
    });
}

// Radar chart configuration
function createRadarChart(canvasId, labels, datasets, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: `rgba(0, 255, 156, ${0.2 + index * 0.1})`,
                borderColor: chartColors.primary,
                borderWidth: 2,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: chartColors.primary
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#7CFFB2',
                    font: {
                        size: 18,
                        weight: 700
                    }
                },
                legend: {
                    labels: {
                        color: '#b6f1c2'
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b6f1c2'
                    },
                    grid: {
                        color: 'rgba(124, 255, 178, 0.1)'
                    },
                    pointLabels: {
                        color: '#7CFFB2',
                        font: {
                            size: 13,
                            weight: 600
                        }
                    }
                }
            }
        }
    });
}

// Export chart functions
window.uyirnilamCharts = {
    createBarChart,
    createLineChart,
    createPieChart,
    createRadarChart,
    chartColors
};
