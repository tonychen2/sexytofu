import React, {Component} from "react";

import BarChart from "./BarChart";

import {Card, CardContent, CardActions} from '@material-ui/core';
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core";


const API_ADDRESS = 'http://127.0.0.1:8000';

const styles = {
    root: {
        backgroundColor: '#ffdbec',
        color: 'grey'
    },
    colorTextPrimary: {
        color: '#fc0a7e'
    },
    actions: {
        justifyContent: 'space-between'
    }
}

class Recommendations extends Component {
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
        // TODO: eliminate the intermediate state of displaying "beef is a great choice"
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
        const classes = this.props.classes;

        return (
            <Card id="recommendations" className={classes.root}>
                <CardContent>
                    <Typography
                        align='left'
                        variant='h5'
                        color='textPrimary'
                        classes={classes}>
                        How can I do better?
                    </Typography>
                    <p align='left'>{this.showRecos()}</p>
                </CardContent>
                <CardActions className={classes.actions}>
                    {this.isApplicable() && <button onClick={this.applyReco}>Apply to grocery list</button>}
                    {this.isLast() || <button onClick={this.nextReco}>Show me more</button>}
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(Recommendations);