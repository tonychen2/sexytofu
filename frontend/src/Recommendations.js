import React, {Component} from "react";
import BarChart from "./BarChart";

const API_ADDRESS = 'http://127.0.0.1:8000';

export default class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {recos: [], indexOnDisplay: 0, is_last: false, is_applicable: true};
    }

    readRecommendations = (recos) => {
        if (recos.length === 0) {
            let food = this.props.food.charAt(0).toUpperCase() + this.props.food.slice(1)
            recos = [`${food} is a great choice! Thank you for helping save the world.`];
            this.setState({is_applicable: false});
        } else {
            recos = recos.map(orig => orig["text_long"]);
            this.setState({is_applicable: true});
        }

        this.setState({recos: recos});

        return recos
    }

    componentDidMount() {
        fetch(`${API_ADDRESS}/recommendations/${this.props.food}/`)
            .then(response => response.json())
            .then(recos => this.readRecommendations(recos));
        // this.setState({recos: [`${this.props.food} recommendation 1`, `${this.props.food} recommendation 2`]});
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            fetch(`${API_ADDRESS}/recommendations/${this.props.food}/`)
                .then(response => response.json())
                .then(recos => this.readRecommendations(recos))
                .then(recos => this.setState({indexOnDisplay: 0, is_last: (recos.length <= 1)}));
        }
    }

    applyReco = () => {
    }

    nextReco = () => {
        // This function assumes what's on display is not the last recommendation
        // Otherwise the button should not have shown, hence this function won't be triggered
        let newIndex = this.state.indexOnDisplay + 1;
        this.setState({indexOnDisplay: newIndex});
        if (newIndex + 1 === this.state.recos.length) {
            this.setState({is_last: true});
        }
    }

    render() {
        return (
            <div id="recommendations">
                <span id="reco_text">{this.state.recos[this.state.indexOnDisplay]}</span>
                {this.state.is_applicable && <button onClick={this.applyReco}>Apply to grocery list</button>}
                {this.state.is_last || <button onClick={this.nextReco}>Show me more</button>}
            </div>
        )
    }
}