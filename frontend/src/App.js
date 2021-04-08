import React, { Component } from 'react';
import GroceryList from "./GroceryList";
import Result from "./Result"
import tofuHero from "./assets/tofu-hero.gif";
import logo from "./assets/logo-text.png";
import  "regenerator-runtime";

const API_ADDRESS = 'https://api.ghgi.org';

class App extends Component {

    state = {apiResponse: {}, hasSearched: false};

    search = async (groceryList) => {
        /**
         * Send grocery list to the GHGI API to retrieve median carbon emission
         * Future extension: error handling
         */

        // const recipe = this.parseQuery();
        console.log(groceryList);
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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': groceryList})}).then(response => response.json()).then(json => this.setState({hasSearched: true, apiResponse: json}));
        console.log(this.state.apiResponse);
        console.log("API response received");
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

    render(){
        return (
            <div id="container">
                <div id="header">
                    <a href="#">
                        <img src={logo} alt="" id="logo"/>
                    </a>
                </div>
                <img src={tofuHero} alt="" id="tofu-hero"/>
                <h2>Sexy Tofu</h2>
                <GroceryList search={this.search}/>
                {this.state.hasSearched && <Result apiResponse={this.state.apiResponse} />}
            </div>
        );
    }
}
export default App;