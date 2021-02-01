import React, { Component } from 'react';
import  "regenerator-runtime";

const API_ADDRESS = 'https://api.ghgi.org';

class App extends Component {
    state = {foodQuery:'', message: ""};

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
            this.searchFood();
            // const data = ;
            
        }
    }

    searchFood = async () => {
        /**
         * Send ingredients to the GHGI API to retrieve median carbon emission
         */

        const recipe = this.parseQuery();

        let json = await fetch(`${API_ADDRESS}/rateCarbon`,
            {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': recipe})}).then(response => response.json());

        console.log("response", json);

        let [impact, contributors] = this.parseResponse(json);

        this.createMessage(impact, contributors);

        // if (json().impact > 0 ){
        //   const food = json().impact.items[0];

        //   console.log('food', food);
        //   this.setState({ food});
        //   }
    }

    parseQuery() {
        /**
         * Parse foodQuery into an array of ingredients
         * Future extension: check for spelling and units
         * @param   {String} text  User input
         * @return  {Array}        List of ingredients with units, e.g. ["a cup of diced onion", "100g of beef"]
         */
        return this.state.foodQuery.split(",");
    }

    parseResponse(json) {
        console.log("Parsing response");
        const impact = json["impact"];
        let contributors = [];

        for (let item of json["items"]) {
            contributors.push([item["names"][0], item["impact"]]);
        }

        contributors.sort((a, b) => b[1] - a[1]);
        return [impact, contributors];
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
        this.setState({message: "PLACEHOLDER MESSAGE"});
        console.log(this.state.message);
    }

    render(){
        return(
            <div> 
                <h2>Sexy Tofu</h2>
                <input 
                onChange={this.updateFoodQuery}
                onKeyPress={this.handleKeyPress}
                placeholder='Find your food'
                />
                <button onClick={this.searchFood}>Search</button>
            </div>
        );
    }
}
export default App;