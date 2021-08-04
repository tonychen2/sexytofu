import React, {useState, Component} from "react";
import  "regenerator-runtime";

import { makeStyles } from '@material-ui/core/styles';
import {Accordion, AccordionSummary, AccordionDetails} from "@material-ui/core";
import {Container} from "@material-ui/core";
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
        margin: '0px'
    },
    accordion: {
        backgroundColor: 'white',
        padding: '80px 0px',
    },
    summary: {
        color: '#322737',
        margin: 'auto',
        paddingBottom: '1em',
    },
    details: {
        maxWidth: '100%',
    },
    dropDown: {
        color: '#322737',
    },
    config: {
        width: '100%',
        textAlign: 'left',
    },
    scaleContainer: {
        width: '100%',
        // TODO: center vertical slider
        // display: 'flex',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent: 'center',
        // alignItems: 'center',
    }
};

const scaleStyles = makeStyles((theme) => ({
    /**
     * Style for the horizontal scale
     */
    root: {
        margin: '100px auto 180px',
        maxWidth: '1000px',
        // width: '100%',
        // Set vertical slider style for small screens only; use horizontal otherwise.
        '@media only screen and (max-width: 600px)': {
            minHeight: '500px',
            '&:last-child': {
                marginBottom: '50px',
            }
        },
        // Override style of Mui-thumb.Mui-disabled
        "& .MuiSlider-thumb": {
            height: '14px',
            width: '14px',
          }
    },
    rail: {
        color: '#828282',
        height: '5px',  
    },
    // User's impact shown on the scale
    thumb: {
        color: '#F251AF',
        // Fix tick marks being slightly off center, to be on center, depending on if horizontal or vertical slider
        '@media only screen and (max-width: 600px)': {
            left: '12px',
        },
        '@media only screen and (min-width: 600px)': {
            top: '12px', 
        },
    },
    valueLabel: {
        left: 'auto',
        top: '-50px',
        // Hide default valueLabel teardrop shape
        '& *': {
            background: 'transparent',
            color: '#000',
          },
        // Change position of label accordingly when vertical slider
        '@media only screen and (max-width: 600px)': {
            top: '0px',
            right: '8ch',
        },
    },
    // Each persona's mark on the scale
    mark: {
        width: '22px',
        height: '22px',
        color: '#C4C4C4',
        borderRadius: '11px',
        // Color of mark when valueLabel is at the same position (markActive)
        backgroundColor: '#C4C4C4',
        opacity: '1',
        // Fix tick marks being slightly off center, to be on center, depending on if horizontal or vertical slider
        '@media only screen and (max-width: 600px)': {
            left: '4px',
        },
        '@media only screen and (min-width: 600px)': {
            top: '4px', 
        },
    },
    markLabel: {
        color: '#C4C4C4'
    },
    markLabelActive: {
        color: '#C4C4C4',
    },
    vertical: {
        '& $rail': {
            width: "5px",
        },
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
                    <AccordionDetails className={classes.details}>
                        {/* Container is to left align text with scale - note maxWidth must match that of scale. */}
                        <Container style={{maxWidth:'1000px', padding: '0px 50px'}}> 
                            <Typography variant='h2' className={classes.summary} align="left">How do I compare to others? </Typography>
                            <div id="config" className={classes.config}>
                                <Typography variant='h4' style={{color: '#322737'}} >
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
                        </Container>
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
                // TODO: scale value is inaccurate for better spacing at sacrifice of accuracy -- try alternating position of labels
                {value: 170, label: <PersonaLabel name="Average American" weeklyImpact='189' icon={avgAmericanIcon} classes={classes} />},
                {value: 224, label: <PersonaLabel name="Meat Lover" weeklyImpact='>224' icon={meatLoverIcon} classes={classes} />}]}
            step={1}
            min={17}
            max={224}
            valueLabelFormat={(value) => <ValueLabel numPeople={props.numPeople} weeklyImpact={value} realImpact={normalizedImpact}/>}
            valueLabelDisplay='on'
            track={false} />
    )
}

function ValueLabel(props) {
    /**
     * React function component for the label of the value (your impact), used in the ComparisonScale's valueLabel
     *
     * @param   {int}   props.numPeople       Number of people this value is for
     * @param   {int}     props.weeklyImpact    Weekly carbon emission of each person, measured by pounds, as clamped by Mui slider
     * @param   {int}     props.realImpact      Weekly carbon emission of each person, measured by pounds, not clamped by Mui slider
     *
     * @return  {HTMLSpanElement}  HTML element for the component
     */
    let label = props.numPeople > 1 ? 'Per person' : 'You';
    // Handle case when weekly impact is greater than or less than lower and upper bounds of Mui slider
    let overflowSign = '';
    if (props.realImpact > props.weeklyImpact) { overflowSign = '>'};
    if (props.realImpact < props.weeklyImpact) { overflowSign = '<'};
    return (
        <Typography variant='body2' style={{color: '#322737', minWidth: '15ch'}}>
            <span style={{display: 'block', fontWeight: 'bold'}}>{label}</span>
            <span style={{display: 'block'}}>{overflowSign}{Math.round(props.weeklyImpact)} lbs/week</span>
        </Typography>)
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
        <Typography variant='body2' style={{color: '#322737'}}>
            <span style={{display: 'block', fontWeight: 'bold'}}>{props.name}</span>
            <span style={{display: 'block'}}>{props.weeklyImpact} lbs/week</span>
            <img src={props.icon} alt={props.name} style={{width: '7vw', minWidth: '8ch'}} />
        </Typography>)
}

export default withStyles(boxStyles)(Comparison);