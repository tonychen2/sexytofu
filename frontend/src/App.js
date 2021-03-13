import React, { Component } from 'react';
import  "regenerator-runtime";

const API_ADDRESS = 'https://api.ghgi.org';

class App extends Component {
    state = {foodQuery:"", grocery_list: [], impact_msg: "", contributor_msg: "", impact: ""};

    updateFoodQuery = event => {
        /**
         * Update state of app to store user input as foodQuery
         */
        console.log('event.target.value', event.target.value);
        this.setState({foodQuery: event.target.value});
    }

    handleKeyPress = event => {
        /**
         * React to key presses
         */
        if (event.key === 'Enter') {
            this.addIngredient();
            // const data = ;
            
        }
    }

    searchFood = async () => {
        /**
         * Send ingredients to the GHGI API to retrieve median carbon emission
         * Future extension: error handling
         */

        // const recipe = this.parseQuery();

        let json = await fetch(`${API_ADDRESS}/rateCarbon`,
            {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': this.state.grocery_list})}).then(response => response.json());

        console.log("response", json);

        let [impact, contributors] = this.parseResponse(json);

        this.createMessage(impact, contributors);
        document.getElementById('foodQuery').value = "";
    }

    // parseQuery() {
    //     /**
    //      * Parse foodQuery into an array of ingredients
    //      * Future extension: check for spelling and units
    //      * @param   {String} text  User input
    //      * @return  {Array}        List of ingredients with units, e.g. ["a cup of diced onion", "100g of beef"]
    //      */
    //     return this.state.foodQuery.split(",");
    // }

    parseResponse(json) {
        /**
         * Parse response from GHGI API to access data points for display
         * @param   {String} json      Response body in json format
         * @return  {[Number, Array]}  Requested data points assembled in an array
         */
        console.log("Parsing response");
        const impact = json["impact"];
        let contributors = [];

        // Find impact of each ingredient and rank them
        for (let item of json["items"]) {
            contributors.push([item["names"][0], item["impact"]]);
        }

        contributors.sort((a, b) => b[1] - a[1]);
        return [impact/contributors.length, contributors];
    }

    createMessage(impact, contributors) {
        /**
         * Based on carbon emission of the ingredients provided, customize the message displayed to the user
         * Future extension: take other params like drive_eq or global_pct
         * @param   {Number} impact        Total CO2 equivalent emissions in grams
         * @param   {Array}  contributors  Top contributors to impact among the ingredients
         */
        console.log("Impact:", impact);
        console.log("Contributors", contributors);
        const ingredient_list_1 = ["beef", "lamb", "pork"]
        const ingredient_list_2 = ["chicken", "cheese", "fish"]
        // const ingredient_list_3 = ["chickpeas", "lentils", "tofu", "soy beans", "kale"]

        let top_contributor = contributors[0][0];
        let recommendation = "";
        if (ingredient_list_1.includes(top_contributor)) {
            recommendation = "Consider replacing it with chicken, cheese, or fish as your source of protein, and help save the world.";
        } else if (ingredient_list_2.includes(top_contributor)) {
            recommendation = "Consider replacing it with chickpeas, lentils, tofu, or kale as your source of protein, and help save the world.";
        } else {
            recommendation = "You are doing great! Thanks for helping save the world."
        }
        this.setState({impact_msg: "The average amount of carbon footprint for your food intake is:"});
        this.setState({impact: impact});
        this.setState({contributor_msg: `${top_contributor} is the biggest contributor to carbon emission in this list, with an impact of ${contributors[0][1]}. ${recommendation}`})
        console.log(this.state.message);
    }

    addIngredient = () => {
        /**
         * Add user input to shopping list
         */
        let grocery_list = this.state.grocery_list;
        grocery_list.push(this.state.foodQuery);

        let listHTML = document.getElementById("groceryList");
        listHTML.innerHTML += "<li>" + this.state.foodQuery + "</li>";

        this.setState({
            foodQuery: "",
            grocery_list: grocery_list});

        document.getElementById('foodQuery').value = "";
    }

    render(){
        return(
            <div> 
                <h2>My Grocery List</h2>
                <ul id="groceryList"></ul>
                <input
                    id="foodQuery"
                    onChange={this.updateFoodQuery}
                    onKeyPress={this.handleKeyPress}
                    placeholder='Add to your grocery list'
                />
                <button onClick={this.addIngredient}>Add</button>
                <button onClick={this.searchFood}>Search</button>
                <h6>{this.state.impact_msg}</h6>
                <h4>{this.state.impact}</h4>
                <h6>{this.state.contributor_msg}</h6>
            </div>
        );
    }
}
export default App;