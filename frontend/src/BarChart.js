import React, { Component } from 'react'
import Chart from 'chart.js';
// import classes from "./LineGraph.module.css";
let myBarChart;

export default class BarChart extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate(prevProps) {
        // Only update chart if necessary at rendering
        if ((this.props.data !== prevProps.data) || (this.props.labels !== prevProps.labels)) {
            this.buildChart();
        }
    }

    handleClick = event => {
        // const myChartRef = this.chartRef.current.getContext("2d");
        const points = myBarChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (points[0]) {
            // const label = myBarChart.data.labels[points[0]._index];
            this.props.showRecommendation(points[0]._index);
        }
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        // const {data, labels} = this.props;
        let type = "bar";
        if (this.props.horizontal) type = "horizontalBar";

        if (typeof myBarChart !== "undefined") myBarChart.destroy();

        Chart.defaults.color = '#ffdbec';

        myBarChart = new Chart(myChartRef, {
            type: type,
            data: {
                //Bring in data
                labels: this.props.labels,
                datasets: [
                    {
                        label: 'Impact by ingredient',
                        data: this.props.data,
                        backgroundColor: '#ffdbec',
                    }
                ]
            },
            options: {
                "hover": {
                    "animationDuration": 0
                },
                "animation": {
                    "duration": 1,
                    "onComplete": function () {
                        myChartRef.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        myChartRef.textAlign = 'left';
                        myChartRef.textBaseline = 'middle';

                        let chartInstance = this.chart;
                        let meta = chartInstance.controller.getDatasetMeta(0);
                        meta.data.forEach((bar, index) => {
                            let value = this.data.datasets[0].data[index].toFixed(1);
                            console.log(bar);
                            myChartRef.fillText(value, bar._model.x+5, bar._model.y);
                        });
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#ffdbec',
                            display: false,
                            max: Math.max(...this.props.data) * 1.2
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: '#ffdbec'
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontColor: '#ffdbec'
                    }
                },
                onClick: this.handleClick
            }
        });
    }

    render() {
        let n_bars = this.props.labels.length;
        console.log(n_bars);
        return (
            <div className="chartContainer" style={{width:"40vw", margin:"0 auto", minHeight: "100px"}}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    style={{height: n_bars * 40, minHeight: 200, maxHeight: 400}}
                />
            </div>
        )
    }
}

