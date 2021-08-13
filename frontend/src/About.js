import React, {useState, Component} from "react";
import {withStyles} from "@material-ui/core";

import {Button} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Box, Typography} from '@material-ui/core';
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
     * React class component of info button with popup for users to learn more about data calculations, and accredation to GHGI.
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
            <Box className={this.props.classes.root}>
                <button variant="contained" className={this.props.classes.infoButton} onClick={this.openPopUp}> 
                    <InfoOutlinedIcon />
                </button>

                <AboutPopUp isOpen={this.state.isOpen} onClose={this.closePopUp} classes={this.props.classes}></AboutPopUp>
            </Box>
        )
    }
}

class AboutPopUp extends Component {
    /**
     * React class component for popup with text content for users to learn more about how numbers were calculated.
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
                    How did we get these numbers?
                    </Typography>   
                </DialogTitle>
                <DialogContent className={this.props.classes.dialogContent}>
                    <DialogContentText>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                        The numbers that you see are based on <b>Life Cycle Assessments</b> that calculate the environmental impacts associated with all the stages of the life cycle of food. 
                        If you’re interested in learning more about the methodology,
                         check out <a href="https://science.sciencemag.org/content/360/6392/987" target="_blank" rel="noopener noreferrer">Joseph Poore’s paper</a>. 
                        </Typography>
                        <Typography component={'span'} variant="body2"> 
                            Source: <a href="https://ghgi.org/about/" target="_blank" rel="noopener noreferrer">GHGI API</a>
                        </Typography>  
                    </DialogContentText>
                </DialogContent>
          </Dialog>
        )
    }
}

export default withStyles(styles)(About); 
