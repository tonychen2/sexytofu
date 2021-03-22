import React, { Component } from 'react';
import BarChart from "./BarChart";
import  "regenerator-runtime";

const API_ADDRESS = 'https://api.ghgi.org';

function GroceryList(props) {
    const list = props.groceryList.map((ingredient) => <li key={ingredient}>{ingredient}</li>)
    return <ul id="groceryList">{list}</ul>
}

class App extends Component {

    state = {foodQuery:"", groceryList: [], hasSearched: false, impact_msg: "", contributor_msg: "",
        avg_impact: 0, contributors: [], impacts: []};

    updateFoodQuery = event => {
        /**
         * Update state of app to store user input as foodQuery
         */
        this.setState({foodQuery: event.target.value});
    }

    handleKeyPress = event => {
        /**
         * React to key presses
         */
        if (event.key === 'Enter') {
            if (this.state.foodQuery === "") {
                this.searchFood();
            } else {
                this.addIngredient();
            }
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
                body: JSON.stringify({'recipe': this.state.groceryList})}).then(response => response.json());

        console.log("response", json);

        let [avg_impact, contributors, impacts] = this.parseResponse(json);
        this.setState({contributors: contributors, hasSearched: true});
        this.setState({impacts: impacts});

        this.createMessage(avg_impact, contributors, impacts);
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
        const total_impact = json["impact"];
        let ingredients = [];

        // Find impact of each ingredient and rank them
        for (let item of json["items"]) {
            ingredients.push([item["names"][0], item["impact"]]);
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

    createMessage(avg_impact, contributors, impacts) {
        /**
         * Based on carbon emission of the ingredients provided, customize the message displayed to the user
         * Future extension: take other params like drive_eq or global_pct
         * @param   {Number} avg_impact        Avg CO2 equivalent emissions across all ingredients in grams
         * @param   {Array}  contributors  Top contributors to impact among the ingredients
         */
        const ingredient_list_1 = ["beef", "lamb", "pork"]
        const ingredient_list_2 = ["chicken", "cheese", "fish"]
        // const ingredient_list_3 = ["chickpeas", "lentils", "tofu", "soy beans", "kale"]

        let top_contributor = contributors[0];
        let recommendation = "";
        if (ingredient_list_1.includes(top_contributor)) {
            recommendation = "Consider replacing it with chicken, cheese, or fish as your source of protein, and help save the world.";
        } else if (ingredient_list_2.includes(top_contributor)) {
            recommendation = "Consider replacing it with chickpeas, lentils, tofu, or kale as your source of protein, and help save the world.";
        } else {
            recommendation = "You are doing great! Thanks for helping save the world."
        }
        this.setState({impact_msg: "The average amount of carbon footprint for your food intake is:"});
        this.setState({avg_impact: avg_impact});
        this.setState({contributor_msg: `${top_contributor} is the biggest contributor to carbon emission in this list, with an impact of ${impacts[0]}. ${recommendation}`})
        console.log(this.state.message);
    }

    addIngredient = () => {
        /**
         * Add user input to shopping list
         */
        let groceryList = this.state.groceryList;
        groceryList.push(this.state.foodQuery);

        // let listHTML = document.getElementById("groceryList");
        // let listHTML = this.refs["groceryList"]
        // listHTML.innerHTML += `<li>${this.state.foodQuery}</li>`;

        this.setState({
            foodQuery: "",
            groceryList: groceryList});
    }

    render(){
        let result = <div id="result">
            <h6>{this.state.impact_msg}</h6>
            <h4>{this.state.avg_impact}</h4>
            <h6>{this.state.contributor_msg}</h6>
            <BarChart data={this.state.impacts} labels={this.state.contributors} horizontal={true}/>
        </div>

        return(
            <div id="container">
                <div id="searchBox">
                    <h2>Sexy Tofu</h2>
                    <GroceryList groceryList={this.state.groceryList} />
                    <input
                        id="foodQuery"
                        onChange={this.updateFoodQuery}
                        onKeyPress={this.handleKeyPress}
                        value={this.state.foodQuery}
                        placeholder='Add to your grocery list'
                    />
                    <button onClick={this.addIngredient}>Add</button>
                    <button onClick={this.searchFood}>Search</button>
                </div>
                {this.state.hasSearched && result}
            </div>
        );
    }
}
export default App;