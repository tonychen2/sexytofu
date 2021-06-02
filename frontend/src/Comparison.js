import React, {useState, Component} from "react";
import  "regenerator-runtime";

import { makeStyles } from '@material-ui/core/styles';
import {Accordion, AccordionSummary, AccordionDetails} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {Select, MenuItem} from "@material-ui/core";
import {Slider} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import {pluralize} from "./utils.js"

const boxStyles = {
    root: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: '#ffdbec',
        textDecoration: 'underline'
    },
    details: {
        backgroundColor: '#ffdbec',
        flexWrap: 'wrap',
        color: 'grey'
    }
};

const scaleStyles = makeStyles((theme) => ({
    root: {
        margin: '50px'
    },
    thumb: {
        color: '#fc0a7e'
    },
    valueLabel: {
        left: 'auto'
    }
}));

const DEFAULT_NUM_PEOPLE = 1;
const DEFAULT_NUM_DAYS = 7;


class Comparison extends Component {
    state = {numPeople: DEFAULT_NUM_PEOPLE, numDays: DEFAULT_NUM_DAYS};

    handleNumPeopleChange = event => {
        this.setState({numPeople: event.target.value});
    }

    handleNumDaysChange = event => {
        this.setState({numDays: event.target.value});
    }

    render() {
        const classes = this.props.classes;

        const selectNumPeople =
            <Select value={this.state.numPeople}
                    onChange={this.handleNumPeopleChange}
                    className={classes.details}>
                {[...Array(10).keys()].map((x) => <MenuItem value={x}>{x}</MenuItem>)}
            </Select>;
        const selectNumDays =
            <Select value={this.state.numDays}
                    onChange={this.handleNumDaysChange}
                    className={classes.details}>
                {[...Array(14).keys()].map((x) => <MenuItem value={x}>{x}</MenuItem>)}
            </Select>;

        return (
            <div id="comparison">
                <Accordion classes={classes} defaultExpanded elevation={0}>
                    <AccordionSummary>
                        <Typography className={classes.root}>See how you compare to others </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        This list is for a household of {selectNumPeople} to consume over {selectNumDays} days.
                        <ComparisonScale totalImpact={this.props.totalImpact}
                                         numPeople={this.state.numPeople}
                                         numDays={this.state.numDays}
                        />

                    </AccordionDetails>
                </Accordion>

            </div>
        )
    }
}

function ComparisonScale(props) {
    const classes = scaleStyles();

    const normalizedImpact = props.totalImpact /
        (props.numPeople / DEFAULT_NUM_PEOPLE) /
        (props.numDays / DEFAULT_NUM_DAYS);

    console.log(props.totalImpact);
    console.log(normalizedImpact);

    return (
        <Slider
            classes={classes}
            component='div'
            disabled
            value={normalizedImpact}
            marks={[
                {value: 17, label: <PersonaLabel name="Sexy Tofu" weeklyImpact='<17' />},
                {value: 76, label: <PersonaLabel name="Global Average" weeklyImpact='76' />},
                {value: 189, label: <PersonaLabel name="Average American" weeklyImpact='189' />},
                {value: 224, label: <PersonaLabel name="Meat Lover" weeklyImpact='>224' />}]}
            step={1}
            min={17}
            max={224}
            valueLabelFormat={(value) =>
                `You: ${normalizedImpact.toFixed(1)} ${pluralize('lb', 'lbs', normalizedImpact)} 
                of CO2 equivalent per week`}
            valueLabelDisplay='on'
            track={false} />
    )
}

function PersonaLabel(props) {
    return (
        <span>
            <span style={{display: 'block'}}>{props.name}</span>
            <span style={{display: 'block'}}>{props.weeklyImpact} lbs/week</span>
        </span>)
}

export default withStyles(boxStyles)(Comparison);