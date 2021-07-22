import React, { Component } from 'react'
import {Chart, CategoryScale, LinearScale, BarController, BarElement} from 'chart.js';
import { fontString } from 'chart.js/helpers'
import Typography from "@material-ui/core/Typography";
let myBarChart;
Chart.register(CategoryScale, LinearScale, BarController, BarElement)

export default class BarChart extends Component {
    /**
     * React class component for the bar chart showing climate impact of each individual food item, ranked in descending order.
     *
     * @param   {array<float>}   data                Carbon emissions for individual food items, measured by pound
     * @param   {array<String>}  labels              Names of each individual food items
     * @param   {function}       selectFood          Callback function for selecting a food item to show recommendations, of signature (int) => ()
     */
    chartRef = React.createRef();

    componentDidMount() {
        /**
         * React lifecycle method. Builds the bar chart.
         */
        this.buildChart();
    }

    componentDidUpdate(prevProps) {
        /**
         * React lifecycle method. Updates the bar chart.
         *
         * @param   {Object}  prevProps  Props from last time componentDidMount or componentDidUpdate was called
         */
        // Only updates chart if necessary at rendering.
        if ((this.props.data !== prevProps.data) || (this.props.labels !== prevProps.labels)) {
            this.buildChart();
        }
    }

    handleClick = event => {
        /**
         * Determines which bar user clicked on
         * and call the function passed in via props to show the appropriate recommendations for that food.
         *
         * @param   {click}  event  User's click event
         */
        const points = myBarChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (points[0]) {
            this.props.selectFood(points[0].index);

            this.highlightSelectedBar(points[0].index);
        }
    }

    highlightSelectedBar = (bar_index) => {
        /**
         * Keeps highlighted the selected bar at bar_index white and the rest of the bars another color.
         */
        myBarChart.data.datasets[0].backgroundColor = this.props.labels.map((food, index) => {return index == bar_index ?  '#ffffff' :  '#ffffff99'});
        myBarChart.update();
      }
      

    buildChart = () => {
        /**
         * Builds the bar chart
         */
        const myChartRef = this.chartRef.current.getContext("2d");
        let type = "bar";

        // Make sure we only have one chart on display
        if (typeof myBarChart !== "undefined") myBarChart.destroy();

        // Set global styling configs for the chart
        Chart.defaults.font.size = 16;
        Chart.defaults.color = '#ffdbec';
        Chart.defaults.borderColor = 'transparent';

        // Create the chart
        myBarChart = new Chart(myChartRef, {
            type: type,
            data: {
                // Bring in data and labels
                labels: this.props.labels,
                datasets: [
                    {
                        data: this.props.data,
                        backgroundColor:'#ffffffaa',
                        hoverBackgroundColor: '#ffffffee',
                        // categoryPercentage: 1.0,
                        // barPercentage: 1.0,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                // clip: {top: 0, right: -2, bottom: 0}, // TODO: remove extra space right and top
                // Show the value for each bar while rendering the chart
                animation: {
                    onProgress: (props) => drawValueLabel(myChartRef, props),
                    onComplete: (props) => drawValueLabel(myChartRef, props)
                },
                // Further customize styling configs for the chart
                scales: {
                    x: {
                        display: false,
                        max: Math.max(...this.props.data) * 1.2
                    },
                    y: {
                        // TODO: https://stackoverflow.com/questions/60188584/chartjs-remove-padding-on-first-and-last-bars-on-barchart remove padding only first and last bars; offset: false,
                        //https://github.com/chartjs/Chart.js/issues/5556
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
        
        // By default, selects the first bar.
        this.highlightSelectedBar(0);
    }

    render() {
        /**
         * React lifecycle method
         *
         * @return   {HTMLDivElement}  HTML element for the BarChart component
         */
        return (
            <div className="chartContainer" style={{width: '80%', margin: 'auto'}}>
                <Typography variant='h5' align='left'>Rank my food's carbon footprint: {this.props.data.reduce((a, b) => a + b, 0).toFixed(1)} pounds</Typography>
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
    /**
     * Draws the value for each bar as a label directly next to it in the canvas.
     * This is achieved by directly accessing the canvas' rendering context, rather than through the Chart.js package API.
     * The Chart.js bar chart object calls this function as an animation during rendering.
     *
     * @param   {CanvasRenderingContext2D}  chartRef     Canvas' rendering context where the bar chart is drawn
     * @param   {Object}                    props        Key-value pairs input to this callback function from Chart's animation
     * @param   {Chart}                     props.chart  The bar chart from Chart.js
     */
    chartRef.font = fontString(
        Chart.defaults.font.size,
        Chart.defaults.font.style,
        Chart.defaults.font.family);
    chartRef.fillStyle = Chart.defaults.color;
    chartRef.textAlign = 'left';
    chartRef.textBaseline = 'middle';

    let chartInstance = props.chart;
    let meta = chartInstance.getDatasetMeta(0);
    // Write the value for each bar into a label
    meta.data.forEach((bar, index) => {
        let value = chartInstance.data.datasets[0].data[index].toFixed(1);
        chartRef.fillText(value, bar.x+5, bar.y);
    });
}