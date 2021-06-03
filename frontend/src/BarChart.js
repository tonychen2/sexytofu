import React, { Component } from 'react'
import Chart from 'chart.js';
import Typography from "@material-ui/core/Typography";
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
        const points = myBarChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (points[0]) {
            this.props.showRecommendation(points[0].index);
        }
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        let type = "bar";

        if (typeof myBarChart !== "undefined") myBarChart.destroy();

        Chart.defaults.font.size = 16;
        Chart.defaults.color = '#ffdbec';
        Chart.defaults.borderColor = 'transparent';

        myBarChart = new Chart(myChartRef, {
            type: type,
            data: {
                //Bring in data
                labels: this.props.labels,
                datasets: [
                    {
                        data: this.props.data,
                        backgroundColor: '#ffdbec',
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                animation: {
                    onProgress: (props) => drawValueLabel(myChartRef, props),
                    onComplete: (props) => drawValueLabel(myChartRef, props)
                },
                scales: {
                    x: {
                        display: false,
                        max: Math.max(...this.props.data) * 1.2
                    },
                    y: {
                        ticks: {
                            textStrokeColor: '#ffdbec'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                },
                onClick: this.handleClick
            }
        });
    }

    render() {
        return (
            <div className="chartContainer" style={{width: '80%', margin: 'auto'}}>
                <Typography variant='h5' align='left'>Rank my food's carbon footprint</Typography>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    style={{maxHeight: 300}}
                />
            </div>
        )
    }
}

function drawValueLabel(chartRef, props) {
    chartRef.font = Chart.helpers.fontString(
        Chart.defaults.font.size,
        Chart.defaults.font.style,
        Chart.defaults.font.family);
    chartRef.fillStyle = Chart.defaults.color;
    chartRef.textAlign = 'left';
    chartRef.textBaseline = 'middle';

    let chartInstance = props.chart;
    let meta = chartInstance.getDatasetMeta(0);
    meta.data.forEach((bar, index) => {
        let value = chartInstance.data.datasets[0].data[index].toFixed(1);
        chartRef.fillText(value, bar.x+5, bar.y);
    });
}