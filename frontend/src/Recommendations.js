import React, {Component} from "react";

import BarChart from "./BarChart";

import {Card, CardContent, CardActions} from '@material-ui/core';
import {Button, Typography, Fab} from "@material-ui/core";
import {withStyles} from "@material-ui/core";

import {joinText} from "./utils.js"

import FavoriteIcon from '@material-ui/icons/Favorite';


const NATIVE_API_ADDRESS =  process.env.API_HOST || "http://localhost:8000";

const ANNUAL_IMPACT_PER_TREE = 26.6;
const IMPACT_PER_MILE = 0.35;

const styles = {   
    root: {
        backgroundColor: 'white',
        width: '80%',
        padding: '20px 35px',
        borderRadius: '20px',
        '& p': {
            margin: '0px',
            overflowY: 'auto',
        },
        '& h5': {
            paddingTop:'0px',
            paddingLeft: '0px',
            paddingRight: '0px',
        },
        '& .MuiCardContent-root': {
            height: '200px',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            '&:last-child': {
            paddingBottom: 0,
            },
        },
        '& .MuiCardActions-root': {
            padding: '0px',
            paddingTop: '2ch',
        },
        '& ::-webkit-scrollbar': {
            // Set default appearance to none, then added custom scroll style, to show up on MacOS
            // https://stackoverflow.com/questions/7855590/preventing-scroll-bars-from-being-hidden-for-macos-trackpad-users-in-webkit-blin
            '& -webkit-appearance' : 'none',
            width: '24px',
        },
        '& ::-webkit-scrollbar-track': {
            backgroundColor: 'white',
            borderRadius: '8px',
        },
        '& ::-webkit-scrollbar-thumb': {
          backgroundColor: 'silver',
        //   borderRadius: '12px',
        //   border: '4px solid white',
          borderLeft: '14px white solid',
          backgroundClip: 'padding-box',
        },
        '& ::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'darkGrey',
          },
    },
    textHead: {
        color: '#322737',
    },
    textBody: {
        overflowY: 'auto',
        flexGrow: '1',
        color: '#322737',
        marginTop: '1ch',
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

    isMore = () => {
        /**
         * Determines if the recommendation on display is already the only one; if so, we won't render the "show me more" button
         */
        return (this.state.recos.length > 0);
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
    }

    nextReco = () => {
        /**
         * Handles clicks on the "show me more" button
         * This function assumes what's on display is not the only recommendation
         */
        let newIndex = (this.state.indexOnDisplay + 1) % this.state.recos.length;
        this.setState({indexOnDisplay: newIndex});
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
                    <div align='center' className={classes.textHead}>
                        <Typography
                            align='center'
                            variant='h5'
                            className={classes.textHead}
                            >
                            {/* TODO: font scaling to fit in one line, https://stackoverflow.com/questions/16056591/font-scaling-based-on-width-of-container
                            https://stackoverflow.com/questions/13358181/resize-font-size-according-to-div-size */}
                            {this.props.food.alias[0].toUpperCase() + this.props.food.alias.substring(1)} - Sustainable options
                        </Typography>
                    </div>
                    {/*<Fab aria-label="like" size='small'>*/}
                    {/*    <FavoriteIcon />*/}
                    {/*</Fab>*/}
                    <div className={classes.textBody}>
                        <Typography variant="body2" align='left' dangerouslySetInnerHTML={this.showReco()} />
                    </div>
                </CardContent>
                <CardActions>
                    {/* TODO: Added hard-coded minimum height to keep overall space constant regardless if Show More visible; change to something less hacky.*/}
                    <div style={{display: 'flex', justifyContent: 'space-between', minHeight: "26px", width: "100%"}}>
                        {/* NOTE: wrap each button in div if you want to align "Apply to list" to right */}
                        {this.isMore() && <button className={'Button'} onClick={this.nextReco}>Show me more</button>}
                        {this.isApplicable() && <button className={'Button'} onClick={this.applyReco}>Apply to grocery list</button>}
                    </div>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(Recommendations);