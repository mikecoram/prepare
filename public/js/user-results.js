if (graphData.marks.length > 0) {
    let lineChart = new Chart('line-graph-container', {
        type: 'line',
        data: {
            labels: graphData.labels,
            datasets: [
                {
                    backgroundColor	: '#3e95cd',
                    label: 'Result',
                    lineTension	: 0,
                    data: graphData.marks,
                    borderColor: "#3e95cd",
                    fill: false,
                }
            ]
        },
        options: {
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Mark'
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Quiz'
                    }
                }]
            }
        }
    });
}