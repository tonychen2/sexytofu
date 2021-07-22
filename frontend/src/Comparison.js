import React, {useState, Component} from "react";
import  "regenerator-runtime";

import { makeStyles } from '@material-ui/core/styles';
import {Accordion, AccordionSummary, AccordionDetails} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {Select, MenuItem} from "@material-ui/core";
import {Slider} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {pluralize} from "./utils.js"

import meatLoverIcon from "./assets/summary_graphics/Tofu_meatlover.png";
import avgAmericanIcon from "./assets/summary_graphics/Tofu_avgamerican.png";
import globalAvgIcon from "./assets/summary_graphics/Tofu_globalavg.png";
import sexyTofuIcon from "./assets/summary_graphics/Tofu_sexytofu.png";

const boxStyles = {
    /**
     * Style for box element outside the comparisons
     */
    div: {
        margin: '50px 0px 10px'
    },
    accordion: {
        backgroundColor: '#ffdbec',
    },
    summary: {
        color: '#fc0a7e',
        margin: 'auto',
        paddingTop: '20px'
    },
    details: {
        // padding: "0px 60px",
        color: 'grey',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropDown: {
        color: 'grey',
    },
    config: {
        width: '100%',
        textAlign: 'center'
    },
    scaleContainer: {
        width: '100%',
    }
};

const scaleStyles = makeStyles((theme) => ({
    /**
     * Style for the horizontal scale
     */
    root: {
        margin: '50px auto 180px',
        maxWidth: '1000px',
        width: '100%',
        // Set vertical slider style for small screens only; use horizontal otherwise.
        '@media only screen and (max-width: 600px)': {
            minHeight: '500px',
            marginTop: '80px',
            '&:last-child': {
                marginBottom: '50px',
            }
        }
    },
    // User's impact shown on the scale
    thumb: {
        color: '#fc0a7e',
        // Rotate thumb when vertical slider. TODO: do not rotate text "You"
        '@media only screen and (max-width: 600px)': {
            transform: 'rotate(-45deg)',
        }
    },
    valueLabel: {
        left: 'auto',
    },
    // Each persona's mark on the scale
    mark: {
        width: '5px',
        height: '5px',
        borderRadius: '2.5px',
        top: '12px',
    },
    markLabel: {
        color: 'grey'
    },
    markLabelActive: {
        color: 'grey'
    }
}));

const DEFAULT_NUM_PEOPLE = 1;
const DEFAULT_NUM_DAYS = 7;


class Comparison extends Component {
    /**
     * React class component for comparing a user's carbon footprint with four persona
     *
     * @param   {Object}  props.classes      Style for the component
     * @param   {float}   props.totalImpact  Total carbon emission of the grocery list, measured by pounds
     * @param   {int}     props.numPeople    # of people the grocery list is for
     * @param   {int}     props.numDays      # of days the grocery list is for
     */
    state = {numPeople: DEFAULT_NUM_PEOPLE, numDays: DEFAULT_NUM_DAYS};

    handleNumPeopleChange = event => {
        /**
         * Allows users to specify how many people the grocery list is for
         *
         * @param   {ChangeEvent<Select>}  event  User's change of selection
         */
        this.setState({numPeople: event.target.value});
    }

    handleNumDaysChange = event => {
        /**
         * Allows users to specify how many days the grocery list is for
         *
         * @param   {ChangeEvent<Select>}  event  User's change of selection
         */
        this.setState({numDays: event.target.value});
    }

    render() {
        /**
         * React lifecycle method
         *
         * @return   {HTMLDivElement}  The Comparison component
         */
        const classes = this.props.classes;

        // Allows users to specify how many people the grocery list is for
        const selectNumPeople =
            <Select value={this.state.numPeople}
                    onChange={this.handleNumPeopleChange}
                    className={classes.dropDown}>
                {[...Array(10).keys()].map((x) => <MenuItem value={x} key={`numPeople-${x}`}>{x}</MenuItem>)}
            </Select>;
        // Allows users to specify how many days the grocery list is for
        const selectNumDays =
            <Select value={this.state.numDays}
                    onChange={this.handleNumDaysChange}
                    className={classes.dropDown}>
                {[...Array(14).keys()].map((x) => <MenuItem value={x} key={`numDays-${x}`}>{x}</MenuItem>)}
            </Select>;

        return (
            <div className={classes.div}>
                <Accordion className={classes.accordion} square defaultExpanded elevation={0}>
                    <AccordionSummary>
                        <Typography variant='h2' className={classes.summary}>How do I compare to others? </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <div id="config" className={classes.config}>
                            <Typography variant='h5' style={{color: 'grey'}} >
                                This list is for&nbsp;
                                {selectNumPeople} {pluralize('person', 'people', this.state.numPeople)}&nbsp;
                                to consume over&nbsp;
                                {selectNumDays} {pluralize('day', 'days', this.state.numDays)}.
                            </Typography>
                        </div>
                        <div className={classes.scaleContainer}>
                            <ComparisonScale totalImpact={this.props.totalImpact}
                                            numPeople={this.state.numPeople}
                                            numDays={this.state.numDays}
                            />
                        </div>

                    </AccordionDetails>
                </Accordion>
            </div>
        )
    }
}

function ComparisonScale(props) {
    /**
     * React function component for the horizontal scale in Comparison
     *
     * @param   {float}   props.totalImpact  Total carbon emission of the grocery list, measured by pounds
     * @param   {int}     props.numPeople    # of people the grocery list is for
     * @param   {int}     props.numDays      # of days the grocery list is for
     *
     * @return  {Slider}  HTML element for the component
     */
    const classes = scaleStyles();

    const normalizedImpact = props.totalImpact /
        (props.numPeople / DEFAULT_NUM_PEOPLE) /
        (props.numDays / DEFAULT_NUM_DAYS);

    // Sets slider to horizontal or vertical depending on screen size.
    let scaleOrientation = useMediaQuery('(max-width:600px)') ? "vertical" : "horizontal";

    return (
        <Slider
            classes={classes}
            component='div'
            disabled
            orientation={scaleOrientation}
            value={normalizedImpact}
            marks={[
                {value: 17, label: <PersonaLabel name="Sexy Tofu" weeklyImpact='<17' icon={sexyTofuIcon} classes={classes} />},
                {value: 76, label: <PersonaLabel name="Global Average" weeklyImpact='76' icon={globalAvgIcon} classes={classes} />},
                {value: 189, label: <PersonaLabel name="Average American" weeklyImpact='189' icon={avgAmericanIcon} classes={classes} />},
                {value: 224, label: <PersonaLabel name="Meat Lover" weeklyImpact='>224' icon={meatLoverIcon} classes={classes} />}]}
            step={1}
            min={17}
            max={224}
            valueLabelFormat={(value) => 'You'}
            valueLabelDisplay='on'
            track={false} />
    )
}

function PersonaLabel(props) {
    /**
     * React function component for the label of each persona, used in the ComparisonScale's marks
     *
     * @param   {float}   props.name          Name of the persona
     * @param   {int}     props.weeklyImpact  Weekly carbon emission of the persona, measured by pounds
     * @param   {String}  props.icon          URL to the persona's icon
     *
     * @return  {HTMLSpanElement}  HTML element for the component
     */
    return (
        <span>
            <span style={{display: 'block'}}>{props.name}</span>
            <span style={{display: 'block'}}>{props.weeklyImpact} lbs/week</span>
            <img src={props.icon} alt={props.name} style={{width: '7vw', minWidth: '8ch'}} />
        </span>)
}

export default withStyles(boxStyles)(Comparison);