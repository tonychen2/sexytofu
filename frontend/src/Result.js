import React, {Component} from "react";
import BarChart from "./BarChart";
import  "regenerator-runtime";

export default class Result extends Component {
    constructor(props) {
        super(props);

        let [avg_impact, contributors, impacts] = this.parseResponse(this.props.apiResponse);
        this.state = {
            avg_impact: avg_impact,
            contributors: contributors,
            impacts: impacts};
    }

    componentDidUpdate(prevProps) {
        if (prevProps.apiResponse !== this.props.apiResponse) {
            let [avg_impact, contributors, impacts] = this.parseResponse(this.props.apiResponse);
            this.setState({avg_impact: avg_impact,
                contributors: contributors,
                impacts: impacts});
        }
    }

    // TODO: Distinguish between originally searched food and actual ingredients
    parseResponse(json) {
        /**
         * Parse response from GHGI API to access data points for display
         * @param   {String} json      Response body in json format
         * @return  {[Number, Array]}  Requested data points assembled in an array
         */
        console.log("Parsing response");
        const total_impact = json["impact"];
        let ingredients = [];

        // Find impact of each ingredient and rank them
        for (let item of json["items"]) {
            ingredients.push([item["product"]["alias"], item["impact"]]);
        }
        ingredients.sort((a, b) => b[1] - a[1]);

        let contributors = [];
        let impacts = [];
        for (let item of ingredients) {
            contributors.push(item[0]);
            impacts.push(item[1]);
        }

        return [total_impact/contributors.length, contributors, impacts];
    }

    render() {
        console.log("rendered");
        return (
            <div id="result">
                <Messages
                    avg_impact={this.state.avg_impact}
                    contributors={this.state.contributors}
                    impacts={this.state.impacts}
                />
                <BarChart data={this.state.impacts} labels={this.state.contributors} horizontal={true}/>
            </div>
        )
    }
}

function Messages(props) {
    /**
     * Based on carbon emission of the ingredients provided, customize the message displayed to the user
     * Future extension: take other params like drive_eq or global_pct
     * @param   {Number} avg_impact        Avg CO2 equivalent emissions across all ingredients in grams
     * @param   {Array}  contributors  Top contributors to impact among the ingredients
     */
    const ingredient_list_1 = ["beef", "lamb", "pork"]
    const ingredient_list_2 = ["chicken", "cheese", "fish"]
    // const ingredient_list_3 = ["chickpeas", "lentils", "tofu", "soy beans", "kale"]

    let top_contributor = props.contributors[0];
    let recommendation = "";
    if (ingredient_list_1.includes(top_contributor)) {
        recommendation = "Consider replacing it with chicken, cheese, or fish as your source of protein, and help save the world.";
    } else if (ingredient_list_2.includes(top_contributor)) {
        recommendation = "Consider replacing it with chickpeas, lentils, tofu, or kale as your source of protein, and help save the world.";
    } else {
        recommendation = "You are doing great! Thanks for helping save the world.";
    }
    let impact_msg = "The average amount of carbon footprint for your food intake is:";
    let contributor_msg = `${top_contributor} is the biggest contributor to carbon emission in this list, with an impact of ${props.impacts[0]}. ${recommendation}`;

    return (
        <div id="Messages">
            <h5>{impact_msg}</h5>
            <h4>{props.avg_impact}</h4>
            <h5>{contributor_msg}</h5>
        </div>
    )
}