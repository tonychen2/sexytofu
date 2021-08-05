import React, {useState, Component} from "react";
import {withStyles} from "@material-ui/core";

import {Button} from '@material-ui/core';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {Grid, Typography} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';


const styles = {
    root: {
        marginLeft: '1ch',
        '& .MuiButton-contained:hover': {
            // Button hover style
            color: 'white',
            backgroundColor: 'transparent',
        }
    },
    button: {
        color: 'white',
        backgroundColor: 'transparent',
    },
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
                <button variant="contained" className={this.props.classes.button} onClick={this.openPopUp}> 
                    <InfoOutlinedIcon />
                </button>

                <AboutPopUp isOpen={this.state.isOpen} onClose={this.closePopUp}></AboutPopUp>
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
            <Dialog open={this.props.isOpen} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="dialogTitle" disableTypography>
                    <Typography variant="h3" style={{color: "#322737"}}> 
                    How did we calculate this?
                    </Typography>   
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography component={'span'} variant="body2"> 
                            We get our carbon emission data from the <a href="https://ghgi.org/about/" target="_blank" rel="noopener noreferrer">GHGI API.</a> {'\n\n'}
                        </Typography>  
                        <Typography component={'span'} variant="body2" display="block">
                            Learn about more about our tool <a href="https://www.sexytofu.org/" target="_blank" rel="noopener noreferrer">here.</a>
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>
                        OK
                    </Button>
                </DialogActions>
          </Dialog>
        )
    }
}

export default withStyles(styles)(About); 