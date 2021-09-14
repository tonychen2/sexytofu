import React, { Component } from 'react';
import  "regenerator-runtime";

import {Grid} from '@material-ui/core';
import {TextField, Checkbox, Button, IconButton, List, ListItem, Typography} from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import DeleteIcon from '@material-ui/icons/Delete';
import {Autocomplete} from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import {createFilterOptions} from '@material-ui/lab/Autocomplete';

const styles = {
    input: {
        position: 'fixed',
        '& > *': {
            width: '40ch',
        },
    },
};

const API_ADDRESS =  process.env.API_HOST || "http://localhost:8000";

let RECO_TYPES = [];
let FOOD_ALIASES = [];


class AddRecoApp extends Component {
    /**
     * Top-level React class component for the main body of the AddReco Portal
     *
     * @param   {Object}  classes  Style of the component
     */
    state = {
        newReco: {
            food_name: null,
            text_short: null,
            text_long: null,
            has_recipe: false,
            impact_once: null,
            replacement_food_name: null,
            calculate_impact: false
        },
        allRecos: [],
        _RECO_TYPES: [],
        _FOOD_ALIASES: [],
        _ALIASES_ONLY: []
    };

    componentDidMount() {
        /**
         * React lifecycle method.
         * Makes API calls to get reco types, food aliases, and existing recommendations from the database
         */
        fetch(`${API_ADDRESS}/food-aliases/`).then(response => response.json())
            .then(json => this.setState({
                _FOOD_ALIASES: json,
                _ALIASES_ONLY: json.reduce((arr, obj) => arr.concat(obj.aliases.split(", ")), [])}));
        fetch(`${API_ADDRESS}/recommendations/`).then(response => response.json()).then(json => this.setState({allRecos: json}));
    }

    handleChange = (event, newValue) => {
        /**
         * Update component state based on user input
         *
         * @param   {ChangeEvent}  event  User's change to form entry
         */
        let fieldId = event.target.id.split("-")[0];
        let newReco = this.state.newReco;
        if (["food_name"].includes(fieldId)) {
            newReco[fieldId] = newValue.name;
        } else if (["has_recipe", "calculate_impact"].includes(fieldId)) {
            newReco[fieldId] = event.target.checked;
        } else {
            newReco[fieldId] = event.target.value;
        }
        this.setState({newReco: newReco});
    }

    handleCreate = () => {
        /**
         * Create a new recommendation in the database based on form entries
         */
        fetch(`${API_ADDRESS}/recommendations/`,
            {method: 'POST',
                body: JSON.stringify(this.state.newReco)})
            .then(response => response.json())
            .then(json => this.setState({allRecos: json}));
    }

    handleDelete = (reco_id) => {
        /**
         * Delete a new recommendation from the database
         *
         * @param   {int}  reco_id  Database id of the recommendation to be deleted
         */
        fetch(`${API_ADDRESS}/recommendations/${reco_id}/`,
            {method: 'DELETE'})
            .then(response => response.json())
            .then(json => this.setState({allRecos: json}));
    }

    inputError = () => {
        return (this.state.newReco["replacement_food_name"] > "") &&
            !(this.state._ALIASES_ONLY.includes(this.state.newReco["replacement_food_name"]));
    }

    render () {
        /**
         * React lifecycle method
         *
         * @return   {Grid}  HTML element for the AddRecoApp component
         */
        return (
            <Grid container id="container">
                <Grid item xs={4} id="input">
                    <form id="inputForm" className={this.props.classes.input} noValidate autoComplete="off">
                        <Autocomplete
                            id="food_name"
                            required
                            options={this.state._FOOD_ALIASES}
                            getOptionLabel={(option) => option.name}
                            filterOptions={createFilterOptions({stringify: option => option.aliases})}
                            renderInput={(params) => <TextField {...params} label="food" required />}
                            autoHighlight
                            onChange={this.handleChange}
                        />
                        <div><TextField id="text_short" label="text_short" required onChange={this.handleChange} /></div>
                        <div><TextField id="text_long" label="text_long" required multiline onChange={this.handleChange} /></div>
                        <div><Checkbox id="has_recipe" color="default" onChange={this.handleChange}/>Has recipe?</div>
                        <div><TextField id="impact_once" label="impact_once (optional)" onChange={this.handleChange} /></div>
                        <div>
                            <TextField id="replacement_food_name"
                                       label="replacement_food (optional)"
                                       onChange={this.handleChange}
                                       error={this.inputError()}
                                       helperText={this.inputError() ? "Food not found" : ""}
                            />
                        </div>
                        <div><Checkbox id="calculate_impact" color="default" onChange={this.handleChange}/>Automatically calculate annual impact based on quantity purchased, and add to the recommendation?</div>
                        <Button variant="outlined" onClick={this.handleCreate}>Submit</Button>
                        <Typography
                            align='left'
                            variant='h5'>
                            Instructions
                        </Typography>
                            <p>
                                1. Please search for and choose a standard food name from the dropdown menu
                            </p>
                            <p>
                                2. To add a recipe link, use the following html format:
                                &lt;a href="[link url]"&gt;link text&lt;/a&gt;
                            </p>
                            <p>
                                3. If the "automatically calculate annual impact" option is selected, the system will
                                add a drive equivalence or tree equivalence of the carbon emission at the end of the
                                recommendation (e.g., "you can offset as much CO2 as 233 trees in a year.") when showing,
                                so make sure it's not redundant with what's already in text_long.
                            </p>
                    </form>
                </Grid>
                <Grid item xs={8} id="allRecos">
                    <Typography
                        align='left'
                        variant='h5'
                        color='textPrimary'>
                        All recommendations
                    </Typography>
                    <List>
                        {this.state.allRecos.map((reco, index) => <RecoRow key={`reco-${index}`} reco={reco} delete={this.handleDelete}/>)}
                    </List>
                </Grid>
            </Grid>
        );
    }
}

function RecoRow(props) {
    /**
     * React function component for each row in the recommendation table
     *
     * @param    {Object}    props.reco    JSON object of the recommendation as returned from database
     * @param    {function}  props.delete  Callback function for deleting a recommendation from the database, of signature (int) => ()
     *
     * @return   {ListItem}                HTML element for the component
     */
    return (
        <ListItem>
            <span>{JSON.stringify(props.reco)}</span>
            <IconButton aria-label="delete" size="small" onClick={() => props.delete(props.reco.id)}>
                <DeleteIcon />
            </IconButton>
        </ListItem>
    );
}

export default withStyles(styles)(AddRecoApp);