import React, {Component} from "react";
import  "regenerator-runtime";

import Box from '@material-ui/core/Box';

const GHGI_API_ADDRESS = 'https://api.ghgi.org';
const NATIVE_API_ADDRESS = 'http://127.0.0.1:8000';

export default class GroceryList extends Component {
    constructor(props) {
        super(props);
        this.state = {groceryList: [], currentQuery: ""};
    }

    componentDidUpdate(prevProps) {
        if (this.props.requestForUpdate !== prevProps.requestForUpdate) {
            let request = this.props.requestForUpdate;
            let index = this.valueToIndex(request['field'], request['oldValue']);
            // TODO: error handling
            if (index === -1) return;
            this.updateFood(index, request['field'], request['newValue']);
            this.props.search(this.state.groceryList);
        }
    }

    valueToIndex = (field, value) => {
        let list = this.state.groceryList.map((item) => item[field]);
        return list.indexOf(value);
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

    addFood = async () => {
        /**
         * Add user input to grocery list
         */
        let json = await fetch(`${NATIVE_API_ADDRESS}/parse/?query=${this.state.currentQuery}`)
            .then(response => response.json());

        let groceryList = this.state.groceryList;
        let name = json['names'][0];
        let quantity = json['qtys'][0]['qty'][0] || 1;
        let unit = json['qtys'][0]['unit'][0] || 'ea';

        groceryList.push({"ingredient": name,
            "quantity": quantity,
            "unit": unit});

        this.setState({groceryList: groceryList, currentQuery: "",});
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
        console.log(`Removing item #${index}`);
        let groceryList = this.state.groceryList;
        groceryList.splice(index, 1);
        console.log(`New list: ${groceryList[0]}`);

        this.setState({groceryList: groceryList});
    }

    render() {
        let list = this.state.groceryList.map((food, index) =>
            <GroceryListItem
                key={index}
                ingredient={food["ingredient"]}
                quantity={food["quantity"]}
                unit={food["unit"]}
                update={(field, newValue) => this.updateFood(index, field, newValue)}
                remove={() => this.removeFood(index)}
                search={() => this.props.search(this.state.groceryList)}
            />);
        if (this.state.groceryList.length > 0) {console.log(this.state.groceryList[0]["ingredient"])};
        return (
            <Box id="groceryList" border={1} borderColor='#ffdbec'>
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
                <form>
                    {list}
                </form>
            </Box>
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
                    id={`${this.props.ingredient}_ingredient`}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.props.ingredient}
                />
                <input
                    className="quantityBox"
                    id={`${this.props.name}_quantity`}
                    type={'number'}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.props.quantity}
                />
                <input
                    className="unitBox"
                    id={`${this.props.name}_unit`}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.props.unit}
                />
                <button className="close" onClick={this.props.remove}>x</button>
            </div>
        );
    }
}