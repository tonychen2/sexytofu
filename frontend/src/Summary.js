import React, {Component} from "react";
import  "regenerator-runtime";

import {List, ListItem} from "@material-ui/core";
import {Grid} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core";

import {pluralize} from "./utils.js"

import driveEqGraphics from "./assets/summary_graphics/tofu_driving.png";
import landUseGraphics from "./assets/summary_graphics/tofu_land.png";
import waterUseGraphics from "./assets/summary_graphics/tofu_water.png";

import TagManager from "react-gtm-module";


const styles = {
    root: {
        textAlign: 'left',
        marginBottom: '100px',
        marginLeft: '20px',
        marginRight: '20px',
    },
    section: {
        '&:not(:first-child)': {
            marginTop: '100px',
            '@media only screen and (max-width: 600px)': {
                marginTop: '50px'
            },
        }
    },
    title: {
        borderRadius: '1ch',
        backgroundColor: 'white',
        width: 'fit-content',
        margin: 'auto',
        padding: '0ch 1ch',
        color: '#E45FC3',
    },
    subtitle: {
        paddingTop: '3ch',
    },
    highlight: {
        fontSize: '120%',
        fontWeight: 'bold'
    },
    image: {
        // display: 'flex',
        display: 'block',
        margin: 'auto',
        maxWidth: '90%',
        maxHeight: '30ch',
    }
};

function Summary(props) {
    /**
     * React function component for a summary of climate impact, including carbon emission, land use, and water consumption.
     *
     * @param   {Object}  props.classes        Style of the component
     * @param   {float}   props.totalImpact    Total carbon emission of the grocery list, measured by pounds
     * @param   {float}   props.driveEq        Total carbon emission of the grocery list, measured by equivalent miles driven in a Toyota Camry
     * @param   {float}   totalLandUse         Total land use of the grocery list, measured by sq.ft.
     * @param   {float}   props.parkingEq      Total land use of the grocery list, measured by # of average parking spots
     * @param   {float}   props.totalWaterUse  Total water consumption of the grocery list, measured by cups
     *
     * @return  {HTMLDivElement}               HTML element for the component
     */
    const classes = props.classes;

    return (
        <div id="summary" className={classes.root}>
            <div id="carbonEmission" className={classes.section}>
                <Typography variant='subtitle1' className={classes.title}>Carbon Emissions</Typography>
                <Grid container direction="row" alignItems="center" justify={"center"}>
                    <Grid item xs={6} sm={6}>
                        <img src={driveEqGraphics} alt='car_driving' className={classes.image}/>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant='subtitle1' className={classes.subtitle}>
                            <span className={classes.highlight}>{props.totalImpact.toFixed(1)}</span>&nbsp;
                            {pluralize('pound', 'pounds', props.totalImpact)} of CO2 or&nbsp;
                            <span className={classes.highlight}>{props.driveEq}</span>&nbsp;
                            {pluralize('mile', 'miles', props.driveEq)} driven in a Toyota Camry
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            {props.totalLandUse > 0 &&
            <div id="landUse" className={classes.section}>
                <Typography variant='subtitle1' className={classes.title}>Land Use</Typography>
                <Grid container direction="row" alignItems="center" justify={"center"}>
                    <Grid item xs={6} sm={6}>
                        <img src={landUseGraphics} alt='Central Park' className={classes.image}/>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography variant='subtitle1' className={classes.subtitle}>
                            <span className={classes.highlight}>{props.totalLandUse.toFixed(1)}</span> sq.ft. or&nbsp;
                            <span className={classes.highlight}>{props.parkingEq.toFixed(1)}</span> parking&nbsp;
                            {pluralize('spot', 'spots', props.parkingEq)} of land used
                        </Typography>
                    </Grid>
                </Grid>
            </div>}
            {props.totalWaterUse > 0 &&
            <div id="waterUse" className={classes.section}>
                <Typography variant='subtitle1' className={classes.title}>Water Consumption</Typography>
                <Grid container direction="row" alignItems="center" justify={"center"}>
                    <Grid item xs={6} sm={6}>
                        <img src={waterUseGraphics} alt='Water' className={classes.image}/>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                       <Typography variant='subtitle1' className={classes.subtitle}>
                            <span className={classes.highlight}>{props.totalWaterUse.toFixed(1)}</span>&nbsp;
                            {pluralize('cup', 'cups', props.totalWaterUse)} of water consumed
                        </Typography>
                    </Grid>`
                </Grid>
            </div>}
        </div>
    )
}

export default withStyles(styles)(Summary);