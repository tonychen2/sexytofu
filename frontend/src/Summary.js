import React, {Component} from "react";
import  "regenerator-runtime";

import {List, ListItem} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {withStyles} from "@material-ui/core";

import {pluralize} from "./utils.js"

import driveEqGraphics from "./assets/summary_graphics/sf-la.png";
import landUseGraphics from "./assets/summary_graphics/parking_spots.png";
import waterUseGraphics from "./assets/summary_graphics/water.png";


const styles = {
    root: {
        // textAlign: 'left'
    },
    section: {
        marginTop: '50px'
    },
    title: {
        borderRadius: '1ch',
        backgroundColor: '#ffdbec',
        width: 'fit-content',
        margin: 'auto',
        padding: '0ch 1ch',
        color: '#fc0a7e'
    },
    highlight: {
        fontSize: '200%',
        fontWeight: 'bold'
    },
    image: {
        // display: 'flex',
        margin: 'auto',
        width: '70%'
    }
};

function Summary(props) {
    const classes = props.classes;

    return (
        <div id="summary" className={classes.root}>
            <div id="driveEq" className={classes.section}>
                <Typography variant='subtitle1' className={classes.title}>Carbon Emissions</Typography>
                <Typography variant='subtitle1'>
                    <span className={classes.highlight}>{props.totalImpact.toFixed(1)}</span>&nbsp;
                    {pluralize('pound', 'pounds', props.totalImpact)} of CO2 or&nbsp;
                    <span className={classes.highlight}>{props.driveEq}</span>&nbsp;
                    {pluralize('mile', 'miles', props.driveEq)} driven in a Toyota Camry
                </Typography>
                <img src={driveEqGraphics} alt='SF-LA' className={classes.image}/>
            </div>
            {props.totalLandUse > 0 &&
            <div id="landUse" className={classes.section}>
                <Typography variant='subtitle1' className={classes.title}>Land Use</Typography>
                <Typography variant='subtitle1'>
                    <span className={classes.highlight}>{props.totalLandUse.toFixed(1)}</span> sq.ft. or&nbsp;
                    <span className={classes.highlight}>{props.parkingEq.toFixed(1)}</span> parking&nbsp;
                    {pluralize('spot', 'spots', props.parkingEq)} of land used
                </Typography>
                <img src={landUseGraphics} alt='Central Park' className={classes.image}/>
            </div>}
            {props.totalWaterUse > 0 &&
            <div id="waterUse" className={classes.section}>
                <Typography variant='subtitle1' className={classes.title}>Water Consumption</Typography>
                <Typography variant='subtitle1'>
                    <span className={classes.highlight}>{props.totalWaterUse.toFixed(1)}</span>&nbsp;
                    {pluralize('cup', 'cups', props.totalWaterUse)} of water consumed
                </Typography>
                <img src={waterUseGraphics} alt='Water' className={classes.image}/>
            </div>}
        </div>
    )
}

export default withStyles(styles)(Summary);