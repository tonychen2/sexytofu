import React, { Component } from 'react';
import  "regenerator-runtime";

import GroceryList from "./GroceryList";
import tofuHero from "./assets/tofu-hero.gif";
import logo from "./assets/logo-text.png";

import Recommendations from "./Recommendations";
import BarChart from "./BarChart";
import Comparison from "./Comparison";
import Summary from "./Summary";
import Feedback from './Feedback';

import {Button} from '@material-ui/core';
import {Box} from '@material-ui/core';
import {Hidden} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import TagManager from "react-gtm-module";


const GHGI_API_ADDRESS = 'https://api.sexytofu.org/api.ghgi.org:443';
const NATIVE_API_ADDRESS =  process.env.API_HOST || "http://localhost:8000";
const FEEDBACK_FORM = 'https://forms.gle/x8NdnQNo3YSkoLN96';


class App extends Component {
    /**
     * Top-level React class component for the main body of the app
     *
     */

    state = {
        hasSearched: false,
        requestForUpdate: [],
        selectedFood: {},
        results: {},
        showPopper: false,
        grocListKey: 0
    };

    updateGroceryList = (food, field, newValue) => {
        /**
         * Callback function for use by the Recommendation component to apply recommendations to grocery list
         *
         * @param   {String}  food      Name of the food the update applies to
         * @param   {String}  field     Name of the field to be updated
         * @param   {T}       newValue  New value of the field for the food
         */
        this.setState({requestForUpdate: {'food': food, 'field': field, 'newValue': newValue}});
    }

    search = async (groceryList) => {
        /**
         * Send grocery list to the GHGI API to retrieve median carbon emission
         * Future extension: error handling
         *
         * @param   {array<Object>}  groceryList  Food items with the signature {"ingredient": String, "quantity": float, "unit": String}
         */
        // Send data to Google Tag Manager
        for (let i = 0; i < groceryList.length; i++) {
            let tagManagerArgs = {
                dataLayer: {
                    event: "searchItem",
                    ingredient: groceryList[i]["ingredient"],
                    quantity: groceryList[i]["quantity"],
                    unit: groceryList[i]["unit"]
                }
            };
            TagManager.dataLayer(tagManagerArgs);
        }

        // Copy out groceryList so we don't change the original array
        let searchList = [...groceryList];

        // Convert grocery list into a format consumable by the GHGI API
        for (let i = 0; i < searchList.length; i++) {
            let food = searchList[i];
            if (food["unit"] === "ea") {
                searchList[i] = `${food["quantity"]} ${food["ingredient"]}`;
            } else {
                searchList[i] = `${food["quantity"]} ${food["unit"]} of ${food["ingredient"]}`;
            }
        }

        // Make the API call and parse the response
        let results = await fetch(`${GHGI_API_ADDRESS}/rate`,
            {method: 'POST',
                body: JSON.stringify({'recipe': searchList})})
            .then(response => response.json())
            .then(json => this.parseResponse(json))
            .then(results => {
                console.log(results);
                return results;
            });

        // Persist the response into state of the App
        if (Math.abs(results.totalImpact) > 1e-5) {
            this.setState({
                hasSearched: true,
                selectedFood: {
                    alias: results.contributors[0],
                    grams: results.grams[0]
                },
                results: results
            });
        } else {
            // Show a popper message in grocery list, suggesting the user add more food
            this.setState({
                showPopper: true
            })
        }

        // Track search and results in Google Tag Manager
        let tagManagerArgs = {
            dataLayer: {
                event: "search",
                groceryListLength: groceryList.length,
                results: results
            }
        };
        TagManager.dataLayer(tagManagerArgs);
    }

    // TODO: Distinguish between L and KG
    getLandUse = async (item) => {
        /**
         * Get land use data of the food item
         *
         * @param   {Object}  item  Food item of signature {"name": String, "impact": float, "grams": float}
         *
         * @return  {float}         Land use, measured by square meter (null if not available)
         */
        if (Math.abs(item.impact) < 1e-5) {
            // Ignore unmatched items
            return 0
        } else {
            let landUse = await fetch(`${NATIVE_API_ADDRESS}/land_use/${item.product}/`)
            .then(response => response.json());
        return (landUse === null ? null : landUse["median"] * (item.grams / 1000));
        }
    }

    // TODO: Distinguish between L and KG
    getWaterUse = async (item) => {
        /**
         * Get water consumption data of the food item
         *
         * @param   {Object}  item  Food item of signature {"name": String, "impact": float, "grams": float}
         *
         * @return  {float}         Water use, measured by liter (null if not available)
         */
        if (Math.abs(item.impact) < 1e-5) {
            // Ignore unmatched items
            return 0
        } else {
            let waterUse = await fetch(`${NATIVE_API_ADDRESS}/water_use/${item.product}/`)
            .then(response => response.json());
            return (waterUse === null ? null : waterUse["median"] * (item.grams / 1000));
        }
    }

    // TODO: Distinguish between originally searched food and actual ingredients
    parseResponse = async (json) => {
        /**
         * Parse response from GHGI API to access data points for display
         *
         * @param    {String} json      Response body in json format
         *
         * @return   {Object}  Requested data points
         */

        let ingredients = [];
        // Find impact of each ingredient and rank them
        for (let item of json["items"]) {
            let impact;
            if (item["match_conf"] >= 0.5) {
                impact = item["impact"] / 1000 * 2.2; // Convert from grams to pounds
            } else {
                impact = 0;
            }
            ingredients.push({
                name: item["names"][0],
                product: item["product"]["alias"],
                impact: impact,
                grams: item["g"]});
        }
        ingredients.sort((a, b) => b.impact - a.impact);
        let totalImpact = ingredients.reduce((acc, curr) => acc + curr.impact, 0);

        let landUses = await Promise.all(ingredients
            .map(async item => await this.getLandUse(item)));
        let totalLandUse = landUses.reduce((x, y) => x + y) * 10.8; // Convert from sq m to sq ft

        let waterUses = await Promise.all(ingredients
            .map(async item => await this.getWaterUse(item)));
        let totalWaterUse = waterUses.reduce((x, y) => x + y) * 4.2; // Convert from liters to cups

        let contributors = [];
        let impacts = [];
        let grams = [];
        for (let item of ingredients) {
            contributors.push(item.name);
            impacts.push(item.impact);
            grams.push(item.grams);
        }

        return {totalImpact: totalImpact,
                contributors: contributors,
                impacts: impacts,
                grams: grams,
                driveEq: json["drive_eq"],
                totalLandUse: totalLandUse,
                // parkingEq: totalLandUse / 14, // Convert from sq meters to # parking spots
                totalTreeUse: totalLandUse / 256, // 256sqft/tree Convert from land use to Californian tree use
                totalWaterUse: totalWaterUse, // Water use in cups
                // totalWaterUse: totalWaterUse, // Water in liters
                totalShowerUse: totalWaterUse / 65.1 // Converts water use to shower use (65.1 liters per shower)
        };
    }

    selectFood = (index) => {
        /**
         * Callback function passes into the BarChart component for selecting a food item to show recommendations
         *
         * @param   {int}  index  Index of the food item in sorted contributors (not grocery list) to be selected
         */
        this.setState({selectedFood: {
            alias: this.state.results.contributors[index],
            grams: this.state.results.grams[index]
        }});

        // Send data to Google Tag Manager
        let tagManagerArgs = {
            dataLayer: {
                event: "checkReco",
                ingredient: this.state.results.contributors[index],
                index: index
            }
        };
        TagManager.dataLayer(tagManagerArgs);
    }
    
    componentDidUpdate() {
        /**
         * React lifecycle method.
         * Ensure the command of showPopper is only sent to GroceryList once
         *
         */
        if (this.state.showPopper) {
            this.setState({showPopper: false});
        }
    }

    onLogoClicked = () => {
        // A hacky way to re-mount a new gocery list by updating an arbitrary key of grocery list, 
        // since React mounts new instance on new key
        this.setState({hasSearched:false, grocListKey: this.state.grocListKey + 1});
    }

    render(){
        /**
         * React lifecycle method
         *
         * @return   {HTMLDivElement}  HTML element for the App component
         */
        const summarySize = 9;
        const barSize = 8;
        const recoSize = 4;

        let headline = (this.state.hasSearched ? "What's my food's impact?" : "Track the climate impact of your food")

        // Override global themes for Typography. TODO: place in separate imported doc. like index.css
        const theme = createMuiTheme({
            typography: {
                h1: {
                    // Headline and Tell Me...
                    fontFamily: ['Lato', 'sans-serif'],
                    fontWeight: 'bolder',
                    fontSize: '2.8rem',
                    color: 'white',
                    '@media only screen and (max-width: 600px)': {
                        fontSize: '2rem', 
                    },
                },
                h2: {
                    // Section headers
                    fontFamily: ['Lato', 'sans-serif'],
                    fontWeight: 'bolder',
                    fontSize: '2rem',
                    color: 'white',
                },
                h3: {
                    fontFamily: ['Lato', 'sans-serif'],
                    fontWeight: 'bolder',
                    fontSize: '1.5rem',
                    color: 'white',
                },
                h4: {
                    fontFamily: ['Lato', 'sans-serif'],
                    fontWeight: 'normal',
                    fontSize: '1.5rem',
                    color: '#322737',
                },
                h5: {
                    // Sub-headers bar chart + recos
                    fontFamily: ['Lato', 'sans-serif'],
                    fontWeight: 'bold',
                    color: 'white',
                },
                subtitle1: {
                    // Summary text + sub-headers
                    fontFamily: ['Lato', 'sans-serif'],
                    fontSize: '1.2rem',
                },
                body1: {
                    // textField
                    fontFamily: ['Lato', 'sans-serif'],
                },
                body2: {
                    // Recos text + slider labels
                    fontFamily: ['Lato', 'sans-serif'],
                    fontWeight: 'normal',
                    fontSize: '1.2rem',
                }
            }
          });

        return (

            <MuiThemeProvider theme={theme}>
            <div id="container">
                <div id="background"></div>
                <div id="header" style={{display: "flex", justifyContent: "space-between"}}>
                    <a href="#">
                        <img src={logo} alt="Sexy Tofu" id="logo" onClick={this.onLogoClicked}/>
                    </a>
                    {this.state.hasSearched && <img src={tofuHero} alt="Tofu Hero" id="tofu-hero" style={{height: '61px'}}/>}
                </div>
                <div id="bottomFloat">
                    <Feedback link={FEEDBACK_FORM}/>
                </div>
                <div id="content">
                    {/* TODO: scroll to recommendation card after bar chart clicked new item. */}
                    {/* https://stackoverflow.com/questions/24739126/scroll-to-a-specific-element-using-html */}
                    {!this.state.hasSearched && <img src={tofuHero} alt="Tofu Hero" id="tofu-hero"/>}
                    <Typography variant='h1' style={{marginBottom: '20px', padding: '0px 20px'}}>{headline}</Typography>
                    {this.state.hasSearched && <Typography variant='subtitle1' style={{marginBottom: '60px', padding: '0px 20px'}}>
                        This is what it takes for food to get to your table.
                    </Typography>}
                    {this.state.hasSearched &&
                    <Grid container justify={"center"}>
                        <Grid item xs={12} md={summarySize}>
                            <Summary
                                totalImpact={this.state.results.totalImpact}
                                driveEq={this.state.results.driveEq}
                                totalLandUse={this.state.results.totalLandUse}
                                totalTreeUse={this.state.results.totalTreeUse}
                                totalWaterUse={this.state.results.totalWaterUse}
                                totalShowerUse={this.state.results.totalShowerUse}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Comparison totalImpact={this.state.results.totalImpact} />
                        </Grid>
                        <Grid item xs={12} sm={12} style={{backgroundImage: 'linear-gradient(180deg, #CF7DE9, #E97DD1)'}}>
                            <Box paddingY='100px'>
                            {/* TODO: better way of formatting than box? */}
                                <Typography variant='h1' style={{marginBottom: '20px', padding: '0px 20px'}}>How can I do better?</Typography>
                                <Typography variant='subtitle1' style={{marginBottom: '40px', padding: '0px 20px'}}>
                                Some simple ways to make small changes for the better!
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} md={barSize}>
                                        <BarChart
                                            data={this.state.results.impacts}
                                            labels={this.state.results.contributors}
                                            selectFood={this.selectFood}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={recoSize}>
                                        {/* TODO: better way of aligning recommendation to chart than this empty box that disappears on small screen? */}
                                        <Hidden smDown>
                                            <Box width="100%" height="60px" />
                                        </Hidden>
                                        {/* TODO: better way of adding padding than box to auto align with chart? */}
                                        <Box paddingX="20px" align='center'>
                                            <div id="reco" />
                                            <Recommendations
                                                food={this.state.selectedFood}
                                                updateGroceryList={this.updateGroceryList}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    }
                    <GroceryList
                        search={this.search}
                        hasSearched={this.state.hasSearched}
                        requestForUpdate={this.state.requestForUpdate}
                        showPopper={this.state.showPopper}
                        key={this.state.grocListKey}
                    />
                </div>
            </div>
            </MuiThemeProvider>
        );
    }
}
export default App;
