import React, {useState, Component} from "react";

import tofuHero from "./assets/tofu-hero.gif";

import {Button} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Grid, Box, TextField, Typography} from '@material-ui/core';
import {withStyles} from "@material-ui/core";


const styles = {
    root: {
        '& .MuiButton-contained:hover': {
            // Button hover style
            color: '#2e3032',
            animation: '$slideOut 0.5s ease-in-out',
            transform: "translateX(0%)",
        }
    },
    button: {
        paddingLeft: '10px',
        textTransform: "none",
        color: '#53575B',
        backgroundColor: '#F9F7F7',
        borderRadius: '18px 0px 0px 18px',
        border: '3px solid #F2F2F2',
        borderRight: 'none',
        marginBottom: '1ch',
        transform: "translateX(80%)",
        animation: '$slideIn 0.5s ease-in-out',
    },
    '@keyframes slideOut': {
        '0%': {
            transform: "translateX(80%)",
        },
        '100%': {
            transform: "translateX(0%)",
        },
    },
    '@keyframes slideIn': {
        '0%': {
            transform: "translateX(0%)",
        },
        '100%': {
            transform: "translateX(80%)",
        },
    },
}

class Feedback extends Component {
    /**
     * React class component for the form that users interact with to input their grocery lists
     *
     * @param   {Object}    props.classes           Style of the component
     */
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
    }

    openPopUp = () => {
        this.setState({isOpen: true});
    }

    closePopUp = () => {
        this.setState({isOpen: false});
    };
    
    render() {
        return (
            <Grid container justify={"flex-end"} className={this.props.classes.root}>
                <Button variant="contained" className={this.props.classes.button} onClick={this.openPopUp}> 
                    <img src={tofuHero} alt="Tofu Hero" id="tofu-hero" style={{height: '25px', marginRight: '6px'}}/>
                    <Typography variant="body2">
                        Share your thoughts!
                    </Typography> 
                </Button>

                <FeedbackPopUp isOpen={this.state.isOpen} onClose={this.closePopUp}></FeedbackPopUp>
            </Grid>
        )
    }
}

class FeedbackPopUp extends Component {
    /**
     * React class component for the form that users interact with to input their grocery lists
     *
     * @param   {Object}    props.classes           Style of the component
     * @param   {Bool}    props.isOpen            Whether component is open
     * @param   {Function}    props.onClose           Callback function to handle when component closes
     */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog open={this.props.isOpen} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="dialogTitle" disableTypography>
                    <Typography variant="h3" style={{color: "#322737"}}> 
                    Send us your feedback! 
                    </Typography>   
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography component={'span'} variant="body2"> 
                            Like Sexy Tofu? Please support us by giving feedback!
                            To participate in beta phase, enter your email address here. We will send updates
                            occasionally.
                            To show you our gratitute, you'll be entered into a raffle.
                        </Typography>  
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>
                        Cancel
                    </Button>
                    <Button onClick={this.props.onClose}>
                        Subscribe
                    </Button>
                </DialogActions>
          </Dialog>
        )
    }
}

export default withStyles(styles)(Feedback);