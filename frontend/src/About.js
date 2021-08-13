import React, {useState, Component} from "react";
import {withStyles} from "@material-ui/core";

import {Button} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Grid, Typography} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';


const styles = {
    root: {
        marginLeft: '1ch',
    },
    infoButton: {
        color: 'white',
        padding: '0px',
        backgroundColor: 'transparent',
        borderRadius: '50%',

        // Center icon in button
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '& :hover': {
            opacity: '0.9',
        }
    },
    dialogContent: {
        padding: '28px 32px',
    },
    dialogTitle: {
        padding: '0px 24px',
        paddingTop: '0px',
    },
    dialogAction: {
        paddingBottom: '0px',
    },
    closeButton: {
        color: '#322737',
        padding: '0px',
        margin: '6px',
        '& :hover': {
            color: 'black',
        }
    }
}

class About extends Component {
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
                <button variant="contained" className={this.props.classes.infoButton} onClick={this.openPopUp}> 
                    <InfoOutlinedIcon />
                </button>

                <AboutPopUp isOpen={this.state.isOpen} onClose={this.closePopUp} classes={this.props.classes}></AboutPopUp>
            </Grid>
        )
    }
}

class AboutPopUp extends Component {
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
            <Dialog 
                open={this.props.isOpen} 
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title" 
                PaperProps={{
                    style: {
                        borderRadius: '20px',
                    }
                }}>
                <DialogActions className={this.props.classes.dialogAction}>
                    <Button className={this.props.classes.closeButton} onClick={this.props.onClose}>
                        <CloseRoundedIcon />
                    </Button>
                </DialogActions>
                <DialogTitle id="dialogTitle" className={this.props.classes.dialogTitle} disableTypography>
                    <Typography variant="h3" style={{color: "#322737"}}> 
                    {/* What does the graph mean? */}
                    How did we get these numbers?
                    </Typography>   
                </DialogTitle>
                <DialogContent className={this.props.classes.dialogContent}>
                    <DialogContentText>
                        {/* <Typography component={'span'} variant="body2"  display="block" align="left" style={{marginBottom: '1rem'}}> 
                        Each bar shows the carbon footprint impact of each food.
                        </Typography> */}
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                        {/* Carbon footprint considers the average amount of CO2 equivalent 
                        emitted from food production, processing, and transportation. 
                        They are based on values found from the 
                        <a href="https://science.sciencemag.org/content/360/6392/987" target="_blank" rel="noopener noreferrer"> 2018 food study </a> 
                        conducted by Joseph Poore. */}

                        The numbers that you see are based on <b>Life Cycle Assessments</b> that calculate the environmental impacts associated with all the stages of the life cycle of food. 
                        If you’re interested in learning more about the methodology, check out
                        <a href="https://science.sciencemag.org/content/360/6392/987" target="_blank" rel="noopener noreferrer"> Joseph Poore’s paper</a>. 
                
                        </Typography>
                        {/* <Typography component={'span'} variant="body2" display="block" style={{marginBottom: '1rem'}}>
                                Learn about more about our tool <a href="https://www.sexytofu.org/" target="_blank" rel="noopener noreferrer">here.</a>
                        </Typography> */}
                        <Typography component={'span'} variant="body2"> 
                            {/* We draw our data from the <a href="https://ghgi.org/about/" target="_blank" rel="noopener noreferrer">GHGI API.</a> {'\n\n'} */}
                            Source: <a href="https://ghgi.org/about/" target="_blank" rel="noopener noreferrer">GHGI API</a>
                        </Typography>  
                    </DialogContentText>
                </DialogContent>
          </Dialog>
        )
    }
}

export default withStyles(styles)(About); 