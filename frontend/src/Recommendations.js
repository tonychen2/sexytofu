import React, {Component} from "react";

import BarChart from "./BarChart";

import {Card, CardContent, CardActions} from '@material-ui/core';
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core";


const API_ADDRESS = 'http://127.0.0.1:8000';
const ANNUAL_IMPACT_PER_TREE = 26.6;
const IMPACT_PER_MILE = 0.35;

const styles = {
    root: {
        backgroundColor: '#ffdbec',
        color: 'grey',
        margin: '0px 30px'
    },
    colorTextPrimary: {
        color: '#fc0a7e'
    },
    actions: {
        justifyContent: 'space-between'
    }
};

class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {recos: [], indexOnDisplay: 0};
    }

    showRecos = () => {
        let reco_text;
        if (this.state.recos.length === 0) {
            // Capitalize the first letter
            let food = this.props.food.alias.charAt(0).toUpperCase() + this.props.food.alias.slice(1);
            reco_text = `${food} is a great choice! Thank you for helping save the world.`;

        } else {
            let reco = this.state.recos[this.state.indexOnDisplay];
            reco_text = reco.text_long;

            // For replacement recommendations, we add an "equivalent to" section, which is random among four options
            // TODO: Error handling!!!!
            if (reco.type_id === 1) {
                let random_group = Math.floor(Math.random() * 2);
                let annual_impact = (this.props.food.grams / 1000) * reco.impact_once * 52;
                if (random_group === 1) {
                    let n_trees = Math.round(annual_impact / ANNUAL_IMPACT_PER_TREE);
                    reco_text += ` you can offset as much CO2 as ${n_trees} trees in a year.`;
                } else {
                    let n_miles = Math.round(annual_impact / IMPACT_PER_MILE);
                    reco_text += ` you'll be saving the equivalent of ${n_miles} miles driven in a car`;
                }
            }
        }

        return {__html: reco_text};
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
        fetch(`${API_ADDRESS}/recommendations/${this.props.food.alias}/`)
            .then(response => response.json())
            .then(recos => this.setState({recos: recos}));
    }

    componentDidUpdate(prevProps) {
        // TODO: eliminate the intermediate state of displaying "beef is a great choice"
        if (prevProps !== this.props) {
            fetch(`${API_ADDRESS}/recommendations/${this.props.food.alias}/`)
                .then(response => response.json())
                .then(recos => this.setState({recos: recos, indexOnDisplay: 0}));
        }
    }

    applyReco = () => {
        let reco = this.state.recos[this.state.indexOnDisplay];
        console.log(reco);
        this.props.updateGroceryList('ingredient', this.props.food.alias, reco['replacement']['name']);
    }

    nextReco = () => {
        // This function assumes what's on display is not the last recommendation
        // Otherwise the button should not have shown, hence this function won't be triggered
        let newIndex = this.state.indexOnDisplay + 1;
        this.setState({indexOnDisplay: newIndex});
    }

    render() {
        const classes = this.props.classes;

        // TODO: Move away from dangerouslySetInnerHTML
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
                    <p align='left' dangerouslySetInnerHTML={this.showRecos()} />
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