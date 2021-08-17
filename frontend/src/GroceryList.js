import React, {Component} from "react";
import  "regenerator-runtime";

import { Collapse } from '@material-ui/core';
import {Grid, Box, Typography} from '@material-ui/core';
import {TextField, Button, IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import {List, ListItem} from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import { Autocomplete } from "@material-ui/lab";
import { withTheme } from "@material-ui/styles";
import { color } from "chart.js/helpers";

import TagManager from 'react-gtm-module'
import { ContactSupport } from "@material-ui/icons";


const GHGI_API_ADDRESS = 'https://api.sexytofu.org/api.ghgi.org:443';
const NATIVE_API_ADDRESS =  process.env.API_HOST || "http://localhost:8000";
// Matches all GHGI units' key values from https://github.com/ghgindex/ghgi/blob/main/ghgi/parser.py
// All units we support, displayed in Autocomplete options
const ALL_UNITS = ['ml', 'l', 'g', 'kg', 'cup', 'teaspoon', 
                    'tablespoon', 'ounce', 'pound', 'quart', 
                    'pint', 'dash', 'pinch', 'handful', 'fistful', 'smidgen', 'ea'];

const styles = {
    root: {
        alignItems: 'center'
    },
    box: {
        padding: '20px',
        paddingBottom: '50px',
        // margin: '50px auto 0px',
        margin: '0px auto 0px',
        // TODO: better way of aligning size of box to headline than maxWidth, and be responsive
        maxWidth: '60ch',
    },
    boxHasSearched: {
        padding: '20px',
        paddingBottom: '50px',
        // margin: '50px auto 0px',
        margin: '0px auto 0px',
        maxWidth: '70ch',
    },
    boxHasSearchedBG: {
        backgroundColor: '#ffffff',
        width: '100%'
    },
    title: {
        marginBottom: '20px'
    },
    groceryTitle: {
        color: '#322737',
        paddingTop: '30px',
        textAlign: 'left',
        '@media only screen and (max-width: 600px)': {
            textAlign: 'center',
        },
    },
    row: {
        padding: '2px 0px',
        flexGrow: 1,
    },
    inputGrid: {
        display: "flex"
    },
    textField: {
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#F2F2F2',
        margin: '2px',
        // textField border styles
        '&:hover': {
            borderColor: '#fc0a7e',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { /* default border style */
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'transparent',
                borderRadius: '10px',
            },
        },
        '& .MuiOutlinedInput-input:-webkit-autofill': {
            // Autofill style
            backgroundColor: '#F2F2F2 !important',
            borderRadius: '10px',
        },
    },
    textFieldHasSearched: {
        /* TODO: How to extend textField class? And some better method than this? */
        width: '100%',
        borderRadius: '10px',
        margin: '2px',
        backgroundColor: '#F2F2F2',
        borderColor: '#F4E6F2',
        '& .MuiOutlinedInput-root': {
            '& fieldset': { /* default border style */
                borderColor: '#DFAAF1',
                borderRadius: '10px',
            },
            '&:hover fieldset': {
                borderColor: '#E8A9DE',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#E8A9DE',
                borderRadius: '10px',
            },
        },
        '& .MuiOutlinedInput-input:-webkit-autofill': {
            // Autofill style
            backgroundColor: '#F2F2F2 !important',
            borderRadius: '10px',
        },
    },
    button: {
        border: '0',
        borderRadius: '10px',
        right: '0',
        margin: '5px',
        backgroundColor: '#F2F2F2',
        color: '#B155D3',
        fontFamily: ['Lato', 'sans-serif'],
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#fc0a7e',
            color: '#ffdbec'
        },
    },
    buttonHasSearched : {
    /* TODO: How to extend button class? */
        border: '0',
        borderRadius: '10px',
        right: '0',
        margin: '5px',
        backgroundColor: '#FEF1FC',
        color: '#B155D3',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#E9D5E5',
            color: '#B155D3',
        }
    },
    errorPopup: {
        border: '0',
        right: '0',
        margin: '5px',
        backgroundColor: '#ef0000',
        color: '#ffdbec',
        '&:hover': {
            backgroundColor: '#b00035',
            color: '#ffbdd9'
        },
    },
    select: {
        // Autocomplete dropdown element styles
        maxHeight: '40px',
        '& .MuiAutocomplete-inputRoot': {
            padding: '0px 6px',
        },
        '&.MuiAutocomplete-hasPopupIcon .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"], \
        .MuiAutocomplete-hasClearIcon .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
            paddingRight: '24px',
        }
    },
}

class GroceryList extends Component {
    /**
     * React class component for the form that users interact with to input their grocery lists
     *
     * @param   {Object}    props.classes           Style of the component
     * @param   {function}  props.search            Callback function for making API calls to get results for the grocery list, of signature (array<Object>) => ()
     * @param   {boolean}   props.hasSearched       Flag indicating whether a search has happened
     * @param   {Object}    props.requestForUpdate  Request from the Recommendation component to update the grocery list,
     *                                              of signature {"food": String, "field": String, "newValue": T}
     */
    constructor(props) {
        super(props);
        this.state = {groceryList: [], currentQuery: "", hasSearchError:false, searchErrorMessage : "defaultErrorMessage"};
    }

    componentDidUpdate(prevProps) {
        /**
         * React lifecycle method.
         * Updates grocery list when a recommendation is applied by user.
         *
         * @param   {Object}  prevProps  Props from last time componentDidMount or componentDidUpdate was called
         */
        if (this.props.requestForUpdate !== prevProps.requestForUpdate) {
            console.log(this.state.groceryList);
            let request = this.props.requestForUpdate;

            // Identify the index of the food to be updated
            let index = this.foodToIndex(request['food']);

            // If the requested food is not found, stop
            // TODO: error handling
            if (index === -1) return;

            // Otherwise, update the grocery list and re-search to refresh the results
            this.updateFood(index, request['field'], request['newValue']);
            this.props.search(this.state.groceryList);
        }
    }

    foodToIndex = (food) => {
        /**
         * Look up the index of a food item
         *
         * @param    {String}  food  Name of the food
         *
         * @return   {int}     Index of the food in this.state.groceryList
         */
        let list = this.state.groceryList.map((item) => item['ingredient']);
        return list.indexOf(food);
    }

    updateQuery = event => {
        /**
         * Update state of GroceryList to store current user input as foodQuery
         *
         * @param   {KeyboardEvent}  event  User keyboard entry
         */
        this.setState({currentQuery: event.target.value});
    }

    handleKeyPress = event => {
        /**
         * Add a food to the Submit the search when an item is highlighted and user hits "enter"
         *
         * @param   {KeyboardEvent}  event  User key press
         */
        if (this.state.hasSearchError) {
            this.setState({hasSearchError : false})
        }   
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
         * Parse user input, find default quantity and unit if needed, and add to grocery list
         */
        // Stop here if there's no query
        if (this.state.currentQuery === "") {
            return
        }

        // Default error message to show if something in search goes wrong.
        let errorMessage = "Something went wrong. Adding food was unsuccessful."

        // Parse user query
        let parsed = await fetch(`${NATIVE_API_ADDRESS}/parse/?query=${this.state.currentQuery}`)
            .then(response => response.json());

        // Find default quantity of food item in gram
        let default_grams = await fetch(`${GHGI_API_ADDRESS}/rate`,
            {method: 'POST',
                // headers: {'Content-Type': 'test/plain', 'Origin':'localhost'},
                body: JSON.stringify({'recipe': [this.state.currentQuery]})})
            .then(response => {
                if (!response.ok) {
                    // POST: 404 (ie. status not ok)
                    throw "Oops! We have a technical issue, but rest assured that help is on the way. Please try again later - thanks for being a Sexy Tofu!";
                } else {
                    return response.json();
                }
            })
            .then(json => {
                if (!('items' in json)) {
                    // GHGI returned a json in unreadable format
                    throw "Oops! We have a technical issue, but rest assured that help is on the way. Please try again later - thanks for being a Sexy Tofu!";
                } else if (json['items'][0]['match_conf'] < 0.5) {
                    // GHGI returned an item with low matching confidence
                    throw `We did our best but weren't able to find "${parsed['names'][0]}" in our database. Perhaps check your spelling or try a different name? Sexy Tofu is working hard to provide data for more food!`;
                } else {
                    return json['items'][0]['g'];
                }
            })
            .catch(err => {
                errorMessage = err;
            });

        if (!default_grams) {
            // Set food search error message for user and stop here if couldn't find food in GHGI database.
            // TODO: use better condition than !default_grams to detect if something in search went wrong?
            this.showSearchError(errorMessage);
            console.warn("Something went wrong, default grams wasn't retrievable from GHGI.");

            // Send data to Google Tag Manager
            let tagManagerArgs = {
                dataLayer: {
                    event: "dataNotFound",
                    gtm: {
                        errorMessage: errorMessage
                    }
                }
            };
            TagManager.dataLayer(tagManagerArgs);

            return;
        }

        // Map default grams to different units and quantities based on pre-defined rules
        // TODO: refine this logic to include super
        let default_qty;
        let default_unit;
        if (default_grams >= 400) {
            default_qty = Math.round(default_grams / 454);
            default_unit = "pound"
        }
        else if (default_grams >= 100) {
            default_qty = Math.round(default_grams / 28);
            default_unit = "ounce";
        }
        else {
            default_qty = default_grams;
            default_unit = "gram";
        }

        // Add food name, quantity, and unit to the grocery list
        let groceryList = this.state.groceryList;
        let name = parsed['names'][0];
        let quantity = parsed['qtys'][0]['qty'][0] || default_qty;
        let unit = parsed['qtys'][0]['unit'][0] || default_unit;

        groceryList.push({
            "ingredient": name,
            "quantity": quantity,
            "unit": unit});

        // Send data to Google Tag Manager
        let tagManagerArgs = {
            dataLayer: {
                event: "parsingComplete",
                query: this.state.currentQuery,
                ingredient: name,
                quantity: quantity,
                unit: unit
            }
        };
        TagManager.dataLayer(tagManagerArgs);

        // Set React state
        this.setState({groceryList: groceryList, currentQuery: ""});
    }

    updateFood = (index, field, newValue) => {
        /**
         * Update an item in shopping list
         *
         * @param   {int}     index  Index of the food item to be updated
         * @param   {String}  field  Field to be updated for the food item
         * @param   {T}       newValue  New value of the field
         */
        let groceryList = this.state.groceryList;

        // Update item in grocery list
        groceryList[index][field] = newValue;

        this.setState({groceryList: groceryList});
    }

    removeFood = (index) => {
        /**
         * Remove an item from shopping list
         *
         * @param   {int}  index  Index of the food item to be removed from GroceryList
         */
        let groceryList = this.state.groceryList;

        // Send data to Google Tag Manager
        let tagManagerArgs = {
            dataLayer: {
                event: "removeItem",
                ingredient: groceryList[index]["ingredient"],
            }
        };
        TagManager.dataLayer(tagManagerArgs);

        // Remove item from grocery list
        groceryList.splice(index, 1);

        this.setState({groceryList: groceryList});
    }

    showSearchError = (message) => {
        this.setState({searchErrorMessage : message})
        this.setState({hasSearchError : true})

    }

    render() {
        /**
         * React lifecycle method
         *
         * @return   {Box}  HTML element for the GroceryList component
         */
        // Create a list of grocery items
        let list = this.state.groceryList.map((food, index) =>
            <GroceryListItem
                key={index}
                ingredient={food["ingredient"]}
                quantity={food["quantity"]}
                unit={food["unit"]}
                update={(field, newValue) => this.updateFood(index, field, newValue)}
                remove={() => this.removeFood(index)}
                search={() => this.props.search(this.state.groceryList)}
                classes={this.props.classes}
                hasSearched = {this.props.hasSearched}
            />);

        // TODO: better method than just switching class names?
        // Change style after search
        let textFieldClass = this.props.hasSearched ? this.props.classes.textFieldHasSearched : this.props.classes.textField;
        let buttonClass = this.props.hasSearched ? this.props.classes.buttonHasSearched : this.props.classes.button;
        return (
            <Box className={this.props.hasSearched ? this.props.classes.boxHasSearchedBG : null}>
                <Box id="groceryList" className={this.props.hasSearched ? this.props.classes.boxHasSearched : this.props.classes.box}>
                    <Grid container className={this.props.classes.root}>
                        {
                            this.props.hasSearched &&
                            <Grid item xs={12} className={this.props.classes.title}>
                                <Typography variant='h2' className={this.props.classes.groceryTitle}>Your List</Typography>
                            </Grid>
                        }
                        {/* TODO: make search bar handle its own states eg updateQuery, and make more generic. */}
                        <Grid item xs={12} sm={12}> 
                            <SearchBar 
                                textFieldClass={textFieldClass} 
                                updateQuery={this.updateQuery} 
                                handleKeyPress={this.handleKeyPress} 
                                currentQuery={this.state.currentQuery}
                                buttonClass={buttonClass}
                                addFood={this.addFood}
                                inputGrid={this.props.classes.inputGrid}
                            />
                        </Grid>

                        {
                            !this.props.hasSearched && this.state.groceryList.length < 1 &&
                            <Grid item xs={12} sm={12}> 
                                <Typography variant='body2' align="left" style={{margin: '40px 0px'}}>
                                    *Enter common foods with amount you would buy on in a grocery run. Estimates are fine. :)
                                </Typography> 
                            </Grid>
                        }

                        {
                            !this.props.hasSearched && this.state.groceryList.length > 0 &&
                            <Grid item xs={12} sm={12}> 
                                <Typography variant='h3' align="center" style={{marginTop: '40px'}}>
                                    Your List
                                </Typography> 
                                <ExpandMoreRoundedIcon fontSize="large"/>
                            </Grid>
                        }

                        {/*An error message if search for food fails.*/}
                        <SearchError 
                            shown={this.state.hasSearchError}
                            message={this.state.searchErrorMessage}
                            classes={this.props.classes}
                            onClick = { () => {
                                this.setState({hasSearchError : false})
                            }}
                        />

                        {/* Items in grocery list */}
                        <form style={{width: '100%'}}>
                            <List>
                                {list}
                            </List>
                        </form>
                    </Grid>

                    {
                      this.state.groceryList.length > 0 &&
                      <Grid container justify={"flex-end"}>
                          <Button className={buttonClass}
                              id="search"
                              variant="contained"
                              align="end"
                              onClick={() => this.props.search(this.state.groceryList)}><span style={{padding: '0px 15px'}}>Search</span>
                          </Button>
                      </Grid>
                    }
                </Box>
            </Box>
        );
    }
}

function SearchBar(props){
    /**
     * Search bar with Add food button for the GroceryList
     * 
     * @param   {Object}    props.textFieldClass    Style of component's textField
     * @param   {function}  props.updateQuery       Callback function to update the current query
     * @param   {function}  props.handleKeyPress    Callback function to handle a key press
     * @param   {String}    props.currentQuery      The current query
     * @param   {Object}    props.buttonClass       Style of component's Add button
     * @param   {function}  props.addFood           Callback function to add food (handle when Add pressed)
     * @param   {Object}    props.inputGrid         Style of component's Grid
     *
     * @return  {HTMLSpanElement}  HTML element for the component
     */
    const input = React.useRef(); 

    const setFocus = () => {
        input.current.focus();
    };

    return (
    <Grid container>
        <Grid item xs={12} sm={10} className={props.inputGrid}>
            <TextField
                id="searchBox"
                inputRef={input}
                autoFocus={true}
                variant="outlined"
                className={props.textFieldClass}
                onChange={props.updateQuery}
                onKeyPress={props.handleKeyPress}
                value={props.currentQuery}
                size='small'
                placeholder='Try "Tofu" or "2 lbs of chicken breast"'
            />
        </Grid>
        <Grid item xs={12} sm={2} container justify="flex-end">
            <Button className={props.buttonClass}
                    variant="contained"
                    onClick={() => {props.addFood(); setFocus();}}><span style={{padding: '0px 30px'}}>Add</span></Button>
        </Grid>
    </Grid>
    )
}

class SearchError extends Component {
    /**
    A dismissable error message that pops up if a search for particular food fails.
    *
    * @param   {Object}    props.classes     Style of the component
    * @param   {bool}  props.hidden      Whether message should be hidden or not.
    */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid item xs={12} sm={12} >
                <Collapse in={this.props.shown}>
                    <Button className={this.props.classes.errorPopup}
                        variant="contained"
                        onClick={this.props.onClick} > 
                        {this.props.message}
                    </Button>
                </Collapse>
            </Grid>
        )
    }

}


class GroceryListItem extends Component{
    /**
     * Individual row in the GroceryList, containing the ingredient, quantity, and unit
     *
     * @param   {Object}    props.classes     Style of the component
     * @param   {String}    props.ingredient  Name of the food item
     * @param   {float}     props.quantity    Quantity of the food item
     * @param   {String}    props.unit        Unit of the food item
     * @param   {function}  props.update      Callback function to update the food item, of signature (String, T) => ()
     * @param   {function}  props.remove      Callback function to remove the food item from the grocery list, of signature () => ()
     * @param   {function}  props.search      Callback function to make API calls for getting climate impact of the grocery list, of signature () => ()
     * @param   {boolean}   props.hasSearched       Flag indicating whether a search has happened
     */
    handleChange = event => {
        /**
         * Update state as the user edits grocery list item
         *
         * @param   {ChangeEvent<TextField>}  event  User's keyboard entry
         */
        if (event.target.id.includes("_ingredient")) {
            // Handle ingredient input
            this.setState({ingredient: event.target.value});
            this.props.update("ingredient", event.target.value);
        }
        else if (event.target.id.includes("_quantity")) {
            // Handle quantity input
            let value = event.target.value;
            if ((value >= 0 || (!value && event.nativeEvent.inputType == "deleteContentBackward")) 
                && !(!value && event.nativeEvent.inputType == "insertText")) {
                // Only allow value change if number is non-negative, or if delete to blank space (so value is NaN but still valid),
                // and ensure value is a number (not NaN) if inserting character
                this.setState({quantity: value});
                this.props.update("quantity", value);

                // TODO: disallow single leading hyphens (without number) inputs, or blank or '.' or '-' when submitting
                // Ideally, do not allow '-' at all as a character input.
            }
        } else {
            console.warn("Whoops! handleChange did nothing for id of " + event.target.id + " and value of " + event.target.value)
        }
    }

    handleUnitChange = (event, value) => {
        /**
         * Update state as the user edits grocery list item unit
         *
         * @param   {ChangeEvent<TextField>}  event  User's keyboard entry
         * @param   {String}                  value  User's new unit value
         */
        this.setState({unit: value});
        this.props.update("unit", value);
    }

    handleKeyPress = event => {
        /**
         * Submit the search when an item is highlighted and user hits "enter"
         *
         * @param   {KeyboardEvent}  event  User's key press
         */
        if (event.key === 'Enter') {
            this.props.search();
        }
    }

    render() {
        /**
         * React lifecycle method
         *
         * @return   {ListItem}  HTML element for the GroceryListItem component
         */
        let textFieldClass = this.props.hasSearched ? this.props.classes.textFieldHasSearched : this.props.classes.textField;
        return (
            <ListItem className={this.props.classes.row}>
                <Grid item xs sm className={this.props.classes.inputGrid}>
                    <TextField
                        variant="outlined"
                        className={textFieldClass}
                        id={`${this.props.ingredient}_ingredient`}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        value={this.props.ingredient}
                        size='small'
                        label="food"
                        // style={{float: "left", clear: 'both'}}
                    />
                </Grid>
                <Grid item xs={4} sm={2} className={this.props.classes.inputGrid}>
                    <TextField
                        variant="outlined"
                        className={textFieldClass}
                        id={`${this.props.ingredient}_quantity`}
                        type={'number'}
                        // Set a minimum value number range can be set to by picker; NOTE: this does NOT restrict what the user can type
                        InputProps={{ inputProps: { min: 0} }}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        value={this.props.quantity}
                        size='small'
                        label="quantity"
                        // style={{float: "left", clear: 'both'}}
                    />
                </Grid>
                <Grid item xs sm className={this.props.classes.inputGrid}>
                    <Autocomplete
                            id={`${this.props.ingredient}_unit`}
                            value={this.props.unit}
                            options={ALL_UNITS}
                            // TODO: allow different spellings for same unit eg. kg and kilogram
                            // filterOptions={createFilterOptions({stringify: option => option.aliases})}
                            renderInput={(params) => <TextField {...params} label="unit" variant="outlined" />}
                            getOptionLabel={(option) => option}
                            autoHighlight
                            disableClearable
                            autoSelect
                            onChange={this.handleUnitChange}
                            className={textFieldClass + ' ' + this.props.classes.select}
                        />
                </Grid>
                <Grid item xs={1} sm={1}>
                    <Grid container justify={"center"}>
                        <IconButton
                            // style={{width: '100%'}}
                            aria-label="delete"
                            size="small"
                            onClick={this.props.remove}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </ListItem>
        );
    }
}

export default withStyles(styles)(GroceryList);
