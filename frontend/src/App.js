import React, { Component } from 'react';
import  "regenerator-runtime";

import GroceryList from "./GroceryList";
import tofuHero from "./assets/tofu-hero.gif";
import logo from "./assets/logo-text.png";

import Recommendations from "./Recommendations";
import BarChart from "./BarChart";
import Comparison from "./Comparison";
import Summary from "./Summary";

import Grid from '@material-ui/core/Grid';
import { List } from '@material-ui/core';

const API_ADDRESS = 'https://api.ghgi.org';


class App extends Component {

    state = {
        hasSearched: false,
        requestForUpdate: [],
        selectedFood: '',
        results: {}
    };

    updateGroceryList = (field, oldValue, newValue) => {
        this.setState({requestForUpdate: {'field': field, 'oldValue': oldValue, 'newValue': newValue}});
    }

    search = async (groceryList) => {
        /**
         * Send grocery list to the GHGI API to retrieve median carbon emission
         * Future extension: error handling
         */

        // const recipe = this.parseQuery();
        groceryList = [...groceryList]
        for (let i = 0; i < groceryList.length; i++) {
            let food = groceryList[i];
            if (food["unit"] === "ea") {
                groceryList[i] = `${food["quantity"]} ${food["ingredient"]}`;
            } else {
                groceryList[i] = `${food["quantity"]} ${food["unit"]} of ${food["ingredient"]}`;
            }
        }

        let json = await fetch(`${API_ADDRESS}/rateCarbon`,
            {method: 'POST',
                //headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': groceryList})})
            .then(response => response.json())
            .then(json => this.parseResponse(json))
            .then(top_contributor => this.setState({
                hasSearched: true,
                selectedFood: top_contributor}));
;
        console.log("API response received");

    }

    // TODO: Distinguish between originally searched food and actual ingredients
    parseResponse(json) {
        /**
         * Parse response from GHGI API to access data points for display
         * @param   {String} json      Response body in json format
         * @return  {[Number, Array]}  Requested data points assembled in an array
         */
        console.log("Parsing response");

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

        this.setState({
            results: {
                totalImpact: json["impact"],
                contributors: contributors,
                impacts: impacts,
                driveEq: json["drive_eq"]}});

        return contributors[0];
    }

    // parseQuery() {
    //     /**
    //      * Parse foodQuery into an array of items
    //      * Future extension: check for spelling and units
    //      * @param   {String} text  User input
    //      * @return  {Array}        List of food items with units, e.g. ["a cup of diced onion", "100g of beef"]
    //      */
    //     return this.state.foodQuery.split(",");
    // }

    showRecommendation(food) {
        this.setState({selectedFood: food});
    }

    render(){
        return (
            <div id="container">
                <div id="header">
                    <a href="#">
                        <img src={logo} alt="" id="logo"/>
                    </a>
                </div>
                <Grid container spacing={3} alignItems="baseline">
                    <Grid item xs={12} sm={6}>
                        <img src={tofuHero} alt="" id="tofu-hero"/>
                        <h2>Track the climate impact of your food</h2>
                        {this.state.hasSearched &&
                        <Summary driveEq={this.state.results.driveEq} />}
                        {this.state.hasSearched &&
                        <Comparison total_imoact={this.state.results.totalImpact} />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <GroceryList search={this.search} requestForUpdate={this.state.requestForUpdate}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {this.state.hasSearched &&
                        <BarChart
                            data={this.state.results.impacts}
                            labels={this.state.results.contributors}
                            horizontal={true}
                            showRecommendation={(food) => this.showRecommendation(food)}
                        />}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {this.state.hasSearched &&
                        <Recommendations
                            food={this.state.selectedFood}
                            updateGroceryList={this.updateGroceryList}
                        />}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default App;