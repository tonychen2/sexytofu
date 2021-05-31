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
        selectedFood: {},
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

        await fetch(`${API_ADDRESS}/rateCarbon`,
            {method: 'POST',
                //headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': groceryList})})
            .then(response => response.json())
            .then(json => this.parseResponse(json));

        this.setState({
            hasSearched: true,
            selectedFood: {
                alias: this.state.results.contributors[0],
                grams: this.state.results.grams[0]
            }});
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

        let ingredients = [];
        // Find impact of each ingredient and rank them
        for (let item of json["items"]) {
            ingredients.push({
                contributor: item["product"]["alias"],
                impact: item["impact"],
                grams: item["g"]});
        }
        ingredients.sort((a, b) => b.impact - a.impact);

        let contributors = [];
        let impacts = [];
        let grams = [];
        for (let item of ingredients) {
            contributors.push(item.contributor);
            impacts.push(item.impact);
            grams.push(item.grams);
        }

        this.setState({
            results: {
                totalImpact: json["impact"],
                contributors: contributors,
                impacts: impacts,
                grams: grams,
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

    showRecommendation(index) {
        this.setState({selectedFood: {
            alias: this.state.results.contributors[index],
            gram: this.state.results.grams[index]
        }});
    }

    render(){
        let infoSize = 12;
        let groceryListSize = 5;
        if (this.state.hasSearched) {
            infoSize = 7;
        }

        return (
            <div id="container">
                <div id="header">
                    <a href="#">
                        <img src={logo} alt="" id="logo"/>
                    </a>
                </div>
                <Grid container spacing={3} justify={"center"}>
                    <Grid item xs={12} sm={infoSize}>
                        <img src={tofuHero} alt="" id="tofu-hero"/>
                        <h2>Track the climate impact of your food</h2>
                        {this.state.hasSearched &&
                        <Summary driveEq={this.state.results.driveEq} />}
                    </Grid>
                    <Grid item xs={12} sm={groceryListSize}>
                        <GroceryList
                            search={this.search}
                            hasSearched={this.state.hasSearched}
                            requestForUpdate={this.state.requestForUpdate}/>
                    </Grid>
                    {this.state.hasSearched &&
                    <Grid item xs={12} sm={12}>
                        <Comparison total_imoact={this.state.results.totalImpact} />
                    </Grid>}
                    {this.state.hasSearched &&
                    <Grid item xs={12} sm={infoSize}>
                        <BarChart
                            data={this.state.results.impacts}
                            labels={this.state.results.contributors}
                            horizontal={true}
                            showRecommendation={this.showRecommendation}
                        />
                    </Grid>}
                    {this.state.hasSearched &&
                    <Grid item xs={12} sm={groceryListSize}>
                        <Recommendations
                            food={this.state.selectedFood}
                            updateGroceryList={this.updateGroceryList}
                        />
                    </Grid>}
                </Grid>
            </div>
        );
    }
}
export default App;