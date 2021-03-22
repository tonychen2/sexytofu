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

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        // const {data, labels} = this.props;
        let type = "bar";
        if (this.props.horizontal) type = "horizontalBar";

        if (typeof myBarChart !== "undefined") myBarChart.destroy();

        myBarChart = new Chart(myChartRef, {
            type: type,
            data: {
                //Bring in data
                labels: this.props.labels,
                datasets: [
                    {
                        label: "Impact by ingredient",
                        data: this.props.data,
                        backgroundColor: "#800080"
                    }
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    render() {
        return (
//            <div className={classes.graphContainer}>
            <div className="chart-container" style={{width:"30vw", margin:"0 auto"}}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

