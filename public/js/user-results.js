let lineChart = new Chart('line-graph-container', {
    type: 'line',
    xAxisID: 'Quiz #',
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
        }
    }
});