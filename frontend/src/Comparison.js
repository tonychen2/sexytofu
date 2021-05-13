import React, {useState, Component} from "react";
import  "regenerator-runtime";

import { makeStyles } from '@material-ui/core/styles';
import {Accordion, AccordionSummary, AccordionDetails} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {Select, MenuItem} from "@material-ui/core";
import {Slider} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const boxStyles = {
    root: {
        backgroundColor: 'transparent',
    },
    summary: {
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
                <Accordion classes={classes} square elevation={0}>
                    <AccordionSummary>
                        <Typography className={classes.summary}>See how you compare to others </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        This list is for a household of {selectNumPeople} to consume over {selectNumDays} days.
                        <ComparisonScale impact={this.props.totalImpact}
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

    const normalizedImpact = props.impact /
        (props.numPeople / DEFAULT_NUM_PEOPLE) /
        (props.numDays / DEFAULT_NUM_DAYS);

    return (
        <Slider
            classes={classes}
            component='div'
            disabled
            value={30}
            marks={[
                {value: 10, label: 'Meat Lover'},
                {value: 20, label: 'Average American'},
                {value: 40, label: 'Sexy Tofu'}]}
            step={1}
            min={10}
            max={40}
            valueLabelFormat={'You'}
            valueLabelDisplay='on'
            track={false} />
    )
}

export default withStyles(boxStyles)(Comparison);