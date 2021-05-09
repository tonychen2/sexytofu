import React, {Component} from "react";
import BarChart from "./BarChart";


const API_ADDRESS = 'http://127.0.0.1:8000';

export default class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {recos: [], indexOnDisplay: 0};
    }

    showRecos = () => {
        if (this.state.recos.length === 0) {
            let food = this.props.food.charAt(0).toUpperCase() + this.props.food.slice(1);
            return `${food} is a great choice! Thank you for helping save the world.`;

        } else {
            return this.state.recos[this.state.indexOnDisplay]["text_long"];

        }
    }

    isLast = () => {
        return (this.state.indexOnDisplay + 1 >= this.state.recos.length);
    }

    isApplicable = () => {
        if (this.state.recos.length > 0) {
            let reco = this.state.recos[this.state.indexOnDisplay]
            // Currently "apply" feature only supports "replace" type recommendations
            return (reco['type_id'] === 1);
        } else {
            return false;
        }
    }

    componentDidMount() {
        fetch(`${API_ADDRESS}/recommendations/${this.props.food}/`)
            .then(response => response.json())
            .then(recos => this.setState({recos: recos}));
        // this.setState({recos: [`${this.props.food} recommendation 1`, `${this.props.food} recommendation 2`]});
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            fetch(`${API_ADDRESS}/recommendations/${this.props.food}/`)
                .then(response => response.json())
                .then(recos => this.setState({recos: recos, indexOnDisplay: 0}));
        }
    }

    applyReco = () => {
        let reco = this.state.recos[this.state.indexOnDisplay];
        this.props.updateGroceryList('ingredient', this.props.food, reco['replacement']['name']);
    }

    nextReco = () => {
        // This function assumes what's on display is not the last recommendation
        // Otherwise the button should not have shown, hence this function won't be triggered
        let newIndex = this.state.indexOnDisplay + 1;
        this.setState({indexOnDisplay: newIndex});
    }

    render() {
        return (
            <div id="recommendations">
                <span id="reco_text">{this.showRecos()}</span>
                {this.isApplicable() && <button onClick={this.applyReco}>Apply to grocery list</button>}
                {this.isLast() || <button onClick={this.nextReco}>Show me more</button>}
            </div>
        )
    }
}