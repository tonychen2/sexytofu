import React, {Component} from "react";

import BarChart from "./BarChart";

import {Card, CardContent, CardActions} from '@material-ui/core';
import {Button, Typography, Fab} from "@material-ui/core";
import {withStyles} from "@material-ui/core";

import {joinText} from "./utils.js"

import FavoriteIcon from '@material-ui/icons/Favorite';
import TagManager from "react-gtm-module";


const NATIVE_API_ADDRESS =  process.env.API_HOST || "http://localhost:8000";

const ANNUAL_IMPACT_PER_TREE = 26.6;
const IMPACT_PER_MILE = 0.35;

const styles = {
    root: {
        backgroundColor: '#ffdbec',
        color: 'grey',
        width: '80%'
    },
    colorTextPrimary: {
        color: '#fc0a7e'
    },
};

class Recommendations extends Component {
    /**
     * React class component for a recommendation card by the bar chart, providing sustainable recommendations for each food item.
     *
     * @param   {Object}  props.classes  Style of the component
     * @param   {Object}  props.food     Selected food to show recommendations for, of signature {'alias': String, 'grams': float}
     */
    constructor(props) {
        /**
         * Optional React lifecycle method. Explicitly provides the list of
         */
        super(props);
        this.state = {recos: [], indexOnDisplay: 0};
    }

    showReco = () => {
        /**
         * Select and construct the recommendation to show
         *
         * @return  {Object}  Contains HTML code for the recommendations
         */
        let reco_text;
        // If no recommendation is available for the food, we compliment the choice
        // TODO: We might need a better line here. There could be some obscure food that is not necessarily sustainable, but we don't have any recommendations
        if (this.state.recos.length === 0) {
            // Capitalize the first letter
            let food = this.props.food.alias.charAt(0).toUpperCase() + this.props.food.alias.slice(1);
            reco_text = `${food} is a great choice! Thank you for helping save the world.`;

        } else {
            // Display one of the recommendations, default to the first one before the user clicks "show me more"
            let reco = this.state.recos[this.state.indexOnDisplay];
            reco_text = reco.text_long;

            // For replacement-type recommendations, we add an "equivalent to" section, which is random among two versions for a/b testing
            // TODO: Error handling!!!!
            // TODO: Record clicks of "apply to grocery list", and compare between the two versions of "equivalent to"
            if (reco.type_id === 1) {
                let random_group = Math.floor(Math.random() * 2);
                let annual_impact = (this.props.food.grams / 1000) * reco.impact_once * 52;
                console.log(this.props.food.grams);
                if (random_group === 1) {
                    let n_trees = Math.round(annual_impact / ANNUAL_IMPACT_PER_TREE);
                    reco_text = joinText(reco_text, `you can offset as much CO2 as ${n_trees} trees in a year!`);
                } else {
                    let n_miles = Math.round(annual_impact / IMPACT_PER_MILE);
                    reco_text = joinText(reco_text, `you'll be saving the equivalent of ${n_miles} miles driven in a car!`);
                }
            }
        }

        return {__html: reco_text};
    }

    isLast = () => {
        /**
         * Determines if the recommendation on display is already the last one; if so, we won't render the "show me more" button
         */
        return (this.state.indexOnDisplay + 1 >= this.state.recos.length);
    }

    isApplicable = () => {
        /**
         * Determines if the recommendation on display is of "replacement" type; if so, we will render the "apply to grocery list" button.
         */
        if (this.state.recos.length > 0) {
            let reco = this.state.recos[this.state.indexOnDisplay]
            // Currently "apply" feature only supports "replace" type recommendations
            return (reco['type_id'] === 1);
        } else {
            return false;
        }
    }

    componentDidMount() {
        /**
         * React lifecycle method.
         * Makes API call to get recommendations for the highest-impact food.
         */
        fetch(`${NATIVE_API_ADDRESS}/recommendations/${this.props.food.alias}/`)
            .then(response => response.json())
            .then(recos => this.setState({recos: recos}));
    }

    componentDidUpdate(prevProps) {
        /**
         * React lifecycle method.
         * Makes API call to get recommendations for the selected food.
         *
         * @param   {Object}  prevProps  Props from last time componentDidMount or componentDidUpdate was called
         */
        // TODO: eliminate the intermediate state of displaying "beef is a great choice"
        if (prevProps !== this.props) {
            fetch(`${NATIVE_API_ADDRESS}/recommendations/${this.props.food.alias}/`)
                .then(response => response.json())
                .then(recos => this.setState({recos: recos, indexOnDisplay: 0}));
        }
    }

    applyReco = () => {
        /**
         * Handles clicks on the "apply to grocery list" button
         */
        let reco = this.state.recos[this.state.indexOnDisplay];
        this.props.updateGroceryList(this.props.food.alias, 'ingredient', reco['replacement']['name']);

        // Send data to Google Tag Manager
        let tagManagerArgs = {
            dataLayer: {
                event: "applyReco",
                ingredient: this.props.food.alias,
                replacement: reco['replacement']['name']
            }
        };
        TagManager.dataLayer(tagManagerArgs);
    }

    nextReco = () => {
        /**
         * Handles clicks on the "show me more" button
         * This function assumes what's on display is not the last recommendation
         * Otherwise the button should not have shown, hence this function won't be triggered
         */
        let newIndex = this.state.indexOnDisplay + 1;
        this.setState({indexOnDisplay: newIndex});

        // Send data to Google Tag Manager
        let tagManagerArgs = {
            dataLayer: {
                event: "nextReco",
                index: newIndex
            }
        };
        TagManager.dataLayer(tagManagerArgs);
    }

    render() {
        /**
         * React lifecycle method.
         *
         * @return   {Card}  HTML element for the Recommendations component
         */
        const classes = this.props.classes;

        // TODO: Move away from dangerouslySetInnerHTML; it was introduced in order to add hyperlinks to recipes
        return (
            <Card id="recommendations" className={classes.root}>
                <CardContent>
                    <Typography
                        align='left'
                        variant='h5'
                        color='textPrimary'
                        classes={classes}>
                        Sustainable option
                    </Typography>
                    {/*<Fab aria-label="like" size='small'>*/}
                    {/*    <FavoriteIcon />*/}
                    {/*</Fab>*/}
                    <p align='left' dangerouslySetInnerHTML={this.showReco()} />
                </CardContent>
                <CardActions>
                    <span style={{justifyContent: 'space-between'}}>
                        {this.isApplicable() && <button className={'Button'} onClick={this.applyReco}>Apply to grocery list</button>}
                        {this.isLast() || <button className={'Button'} onClick={this.nextReco}>Show me more</button>}
                    </span>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(Recommendations);