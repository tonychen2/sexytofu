import React, {Component} from "react";
import  "regenerator-runtime";

const API_ADDRESS = 'https://api.ghgi.org';

export default class GroceryList extends Component {
    constructor(props) {
        super(props);
        this.state = {groceryList: [], currentQuery: ""};
    }

    updateQuery = event => {
        /**
         * Update state of GroceryList to store current user input as foodQuery
         */
        this.setState({currentQuery: event.target.value});
    }

    handleKeyPress = event => {
        /**
         * React to key presses
         */
        if (event.key === 'Enter') {
            if (this.state.currentQuery === "") {
                this.props.search(this.state.groceryList);
            } else {
                this.addFood();
            }
        }
    }

    addFood = () => {
        /**
         * Add user input to grocery list
         */
        this.searchFood(this.state.currentQuery);

        this.setState({
            currentQuery: ""});
    }

    updateFood = (index, field, newValue) => {
        /**
         * Update an item in shopping list
         */
        let groceryList = this.state.groceryList;
        groceryList[index][field] = newValue;

        this.setState({groceryList: groceryList});
    }

    removeFood = (index) => {
        /**
         * Remove an item from shopping list
         */
        let groceryList = this.state.groceryList;
        groceryList.splice(index, 1);

        this.setState({groceryList: groceryList});
    }

    searchFood = async (food) => {
        /**
         * Send food item to the GHGI API to retrieve default quantity
         * Future extension: error handling
         */

        let json = await fetch(`${API_ADDRESS}/rateCarbon`,
            {method: 'POST',
                //headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'recipe': [food]})}).then(response => response.json());
        console.log(json);

        let groceryList = this.state.groceryList;
        let item = json["items"][0];
        groceryList.push({"ingredient": item["product"]["alias"], "quantity": item["qtys"][0]["qty"][0], "unit": item["qtys"][0]["unit"][0]});
        this.setState({groceryList: groceryList})
    }

    render() {
        const list = this.state.groceryList.map((food, index) =>
            <GroceryListItem
                key={index}
                ingredient={food["ingredient"]}
                quantity={food["quantity"]}
                unit={food["unit"]}
                update={(field, newValue) => this.updateFood(index, field, newValue)}
                remove={() => this.removeFood(index)}
                search={() => this.props.search(this.state.groceryList)}
            />)
        return (
            <div id="groceryList">
                <div id="search">
                    <input
                        id="searchBox"
                        onChange={this.updateQuery}
                        onKeyPress={this.handleKeyPress}
                        value={this.state.currentQuery}
                        placeholder='Try "Tofu" or "2 lbs of chicken breast"'
                    />
                    <button onClick={this.addFood}>Add</button>
                    <button onClick={() => this.props.search(this.state.groceryList)}>Search</button>
                </div>
                {/*<ColumnNames />*/}
                {list}
            </div>
        );
    }
}

function ColumnNames() {
    return (<div id="columnNames">
        <span className="ingredientBox">Ingredient</span>
        <span className="quantityBox">Quantity</span>
        <span className="unitBox">Unit</span>
    </div>)
}

class GroceryListItem extends Component{
    constructor(props) {
        super(props);
        this.state = {dish: props.dish, ingredient: props.ingredient, quantity: props.quantity, unit: props.unit};
    }

    handleChange = event => {
        if (event.target.id.includes("_ingredient")) {
            this.setState({ingredient: event.target.value});
            this.props.update("ingredient", event.target.value);
        }
        else if (event.target.id.includes("_quantity")) {
            this.setState({quantity: event.target.value});
            this.props.update("quantity", event.target.value);
        } else {
            this.setState({unit: event.target.value});
            this.props.update("unit", event.target.value);
        }
    }

    handleKeyPress = event => {
        /**
         * React to key presses
         */
        if (event.key === 'Enter') {
            this.props.search();
        }
    }

    render() {
        return (
            <div className="groceryListItem">
                <input
                    className="ingredientBox"
                    id={`${this.state.ingredient}_ingredient`}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.state.ingredient}
                />
                <input
                    className="quantityBox"
                    id={`${this.state.name}_quantity`}
                    type={'number'}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.state.quantity}
                />
                <input
                    className="unitBox"
                    id={`${this.state.name}_unit`}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.state.unit}
                />
                <button className="close" onClick={this.props.remove}>x</button>
            </div>
        );
    }
}