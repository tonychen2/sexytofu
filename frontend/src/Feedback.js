import React, {useState, Component} from "react";

import tofuThx from "./assets/summary_graphics/tofu_thanks.png";

import {Button} from '@material-ui/core';
import {Box, Typography} from '@material-ui/core';
import {withStyles} from "@material-ui/core";


const styles = {
    root: {
        width:'100%', 
        display: 'inline-flex', 
        justifyContent: 'flex-end',
        '& .MuiButton-contained:hover': {
            // Button hover style
            color: '#2e3032',
            // animation: '$slideOut 0.5s ease-in-out',
            // transform: "translateX(0%)",
        }
    },
    button: {
        // paddingLeft: '12px',
        padding: '6px 4px 6px 12px',
        textTransform: "none",
        color: '#53575B',
        backgroundColor: '#F9F7F7',
        borderRadius: '18px 0px 0px 18px',
        border: '3px solid #F2F2F2',
        borderRight: 'none',
        marginBottom: '1ch',
        // transform: "translateX(80%)",
        // animation: '$slideIn 0.5s ease-in-out',
    },
    // Animation to slide button in and out on hover.
    // '@keyframes slideOut': {
    //     '0%': {
    //         transform: "translateX(80%)",
    //     },
    //     '100%': {
    //         transform: "translateX(0%)",
    //     },
    // },
    // '@keyframes slideIn': {
    //     '0%': {
    //         transform: "translateX(0%)",
    //     },
    //     '100%': {
    //         transform: "translateX(80%)",
    //     },
    // },
}

class Feedback extends Component {
    /**
     * React class component for the feedback button which opens link to google form survey on click.
     *
     * @param   {Object}    props.classes           Style of the component
     * @param   {String}    props.link              Link to open when feedback button clicked.
     */
    constructor(props) {
        super(props);
    }

    openLink = (link) => {     
        // Opens link in new tab or window.
        window.open(link, '_blank','noopener');
    }
    
    render() {
        return (
            <Box className={this.props.classes.root}>
                <Button variant="contained" className={this.props.classes.button} onClick={() => {this.openLink(this.props.link)}}> 
                    <Typography variant="body2">
                        Share your thoughts!
                    </Typography> 
                    <img src={tofuThx} alt="Tofu Thanks" id="tofu-thanks" style={{height: '25px', marginLeft: '6px'}}/>
                </Button>
            </Box>
        )
    }
}

export default withStyles(styles)(Feedback);
