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
import Typography from "@material-ui/core/Typography";

const GHGI_API_ADDRESS = 'https://api.ghgi.org';
const NATIVE_API_ADDRESS = 'http://127.0.0.1:8000';


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

        let results = await fetch(`${GHGI_API_ADDRESS}/rateCarbon`,
            {method: 'POST',
                //headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': groceryList})})
            .then(response => response.json())
            .then(json => this.parseResponse(json));

        this.setState({
            hasSearched: true,
            selectedFood: {
                alias: results.contributors[0],
                grams: results.grams[0]
            },
            results: results
        });
    }

    // TODO: Distinguish between L and KG
    getLandUse = async (item) => {
        let landUse = await fetch(`${NATIVE_API_ADDRESS}/land_use/${item.name}/`)
            .then(response => response.json());
        return (landUse === null ? null : landUse["median"] * (item.grams / 1000));
    }

    // TODO: Distinguish between L and KG
    getWaterUse = async (item) => {
        let waterUse = await fetch(`${NATIVE_API_ADDRESS}/water_use/${item.name}/`)
            .then(response => response.json());
        return (waterUse === null ? null : waterUse["median"] * (item.grams / 1000));
    }

    // TODO: Distinguish between originally searched food and actual ingredients
    parseResponse = async (json) => {
        /**
         * Parse response from GHGI API to access data points for display
         * @param   {String} json      Response body in json format
         * @return  {[Number, Array]}  Requested data points assembled in an array
         */

        let ingredients = [];
        // Find impact of each ingredient and rank them
        for (let item of json["items"]) {
            ingredients.push({
                name: item["product"]["alias"],
                impact: item["impact"] / 1000 * 2.2, // Convert from grams to pounds
                grams: item["g"]});
        }
        ingredients.sort((a, b) => b.impact - a.impact);

        let landUses = await Promise.all(ingredients
            .map(async item => await this.getLandUse(item)));
        let totalLandUse = landUses.reduce((x, y) => x + y) * 10.8; // Convert from sq m to sq ft

        let waterUses = await Promise.all(ingredients
            .map(async item => await this.getWaterUse(item)));
        let totalWaterUse = waterUses.reduce((x, y) => x + y) * 4.2; // Convert from liters to cups

        let contributors = [];
        let impacts = [];
        let grams = [];
        for (let item of ingredients) {
            contributors.push(item.name);
            impacts.push(item.impact);
            grams.push(item.grams);
        }

        return {totalImpact: json["impact"] / 1000 * 2.2, // Convert from grams to pounds
                contributors: contributors,
                impacts: impacts,
                grams: grams,
                driveEq: json["drive_eq"],
                totalLandUse: totalLandUse,
                parkingEq: totalLandUse / 14, // Convert from sq meters to # parking spots
                totalWaterUse: totalWaterUse * 4.2
        };
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

    showRecommendation = (index) => {
        console.log(this.state);
        this.setState({selectedFood: {
            alias: this.state.results.contributors[index],
            grams: this.state.results.grams[index]
        }});
    }

    render(){
        const infoSize = 12;
        const summarySize = 6;
        const groceryListSize = 12;
        const barSize = 8;
        const recoSize = 4;

        let headline = (this.state.hasSearched ? "My food impact" : "Track the climate impact of my food")

        return (
            <div id="container">
                <div id="header">
                    <a href="#">
                        <img src={logo} alt="Sexy Tofu" id="logo"/>
                    </a>
                </div>
                <img src={tofuHero} alt="Tofu Hero" id="tofu-hero"/>
                <h2>{headline}</h2>
                {this.state.hasSearched &&
                <Grid container spacing={3} justify={"center"}>
                    <Grid item xs={12} sm={summarySize}>
                        <Summary
                            totalImpact={this.state.results.totalImpact}
                            driveEq={this.state.results.driveEq}
                            totalLandUse={this.state.results.totalLandUse}
                            parkingEq={this.state.results.parkingEq}
                            totalWaterUse={this.state.results.totalWaterUse}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Comparison totalImpact={this.state.results.totalImpact} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <h2 style={{marginBottom: '40px'}}>Tell me how I can do better</h2>
                    </Grid>
                    <Grid item xs={12} sm={barSize}>
                        <BarChart
                            data={this.state.results.impacts}
                            labels={this.state.results.contributors}
                            horizontal={true}
                            showRecommendation={this.showRecommendation}
                        />
                    </Grid>
                    <Grid item xs={12} sm={recoSize}>
                        <Recommendations
                            food={this.state.selectedFood}
                            updateGroceryList={this.updateGroceryList}
                        />
                    </Grid>
                </Grid>
                }
                    <GroceryList
                        search={this.search}
                        hasSearched={this.state.hasSearched}
                        requestForUpdate={this.state.requestForUpdate}/>
            </div>
        );
    }
}
export default App;