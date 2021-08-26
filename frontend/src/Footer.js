import React, {useState, Component} from "react";

import {Button} from '@material-ui/core';
import {Box, Grid, Typography} from '@material-ui/core';
import {withStyles} from "@material-ui/core";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TikTokIcon from './assets/tiktok.svg';

const styles = {
    root: {
        width:'100%',
        display: 'flex'
    },
    button: {
        color: 'white',
        backgroundColor: 'transparent',
        margin: '2px',
        // '& :hover': {
        //     color: '#322737',
        // }
    },
    text: {
        margin: '0px 6px',
        display: 'inline-block',
    },
    policy: {
        margin: '0px 6px',
        display: 'inline-block',
        textDecoration: 'underline',
        '&:hover': {
            color: '#322737',
            cursor: 'pointer',
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

class Footer extends Component {
    /**
     * React class component for the footer containing: social media links, copyright, privacy policy.
     *
     * @param   {Object}    props.classes           Style of the component
     * @param   {String}    props.instagram              Link to open instagram social media.
     * @param   {String}    props.facebook               Link to open facebook social media.
     * @param   {String}    props.tiktok                 Link to open tiktoksocial media.
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

    openLink = (link) => {     
        // Opens link in new tab or window.
        window.open(link, '_blank','noopener');
    }
    
    render() {
        return (
            <Grid container className={this.props.classes.root} justify="flex-end">
                <Grid item xs={12} sm={12}>
                    <Typography className={this.props.classes.policy} onClick={this.openPopUp}>Privacy Policy</Typography>
                    <PolicyPopUp isOpen={this.state.isOpen} onClose={this.closePopUp} classes={this.props.classes} />
                    <Typography className={this.props.classes.text}>Copyright © 2021 SexyTofu</Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                <div id="socials">
                    <button variant="contained" className={this.props.classes.button} onClick={() => {this.openLink(this.props.instagram)}}> 
                        <InstagramIcon />
                    </button>
                    <button variant="contained" className={this.props.classes.button} onClick={() => {this.openLink(this.props.facebook)}}> 
                        <FacebookIcon />
                    </button>
                    <button variant="contained" className={this.props.classes.button} onClick={() => {this.openLink(this.props.tiktok)}}> 
                        <img src={TikTokIcon} alt={"TikTok"}></img>
                    </button>
                </div>
                </Grid>
            </Grid>
        )
    }
}


class PolicyPopUp extends Component {
    /**
     * React class component for popup with text content on our Privacy Policy.
     *
     * @param   {Object}    props.classes           Style of the component
     * @param   {Bool}      props.isOpen            Whether component is open
     * @param   {Function}  props.onClose           Callback function to handle when component closes
     */
    constructor(props) {
        super(props);
    }

    render() {
        const LAST_UPDATED_DATE = "August 26 2021"
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
                    Privacy Policy
                    </Typography>   
                </DialogTitle>
                <DialogContent className={this.props.classes.dialogContent}>
                    <DialogContentText>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                        Last updated: <b>{LAST_UPDATED_DATE}</b>
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            {/* Google Analytics TOS https://marketingplatform.google.com/about/analytics/terms/us/ */}
                            {/* Text form https://www.termsfeed.com/public/uploads/2019/04/privacy-policy-template.pdf */}
                            <b>Sexy Tofu</b> operates <a href="https://www.sexytofu.org/">https://www.sexytofu.org/</a> (the&nbsp;
                            "Site"). This page informs you of our policies regarding the collection, use and disclosure of&nbsp;
                            Personal Information we receive from users of the Site.&nbsp;
                            We use your Personal Information only for providing and improving the Site. By using the Site, you&nbsp;
                            agree to the collection and use of information in accordance with this policy.&nbsp;
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Cookies
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            Cookies are files with small amount of data, which may include an anonymous unique identifier.&nbsp;
                            Cookies are sent to your browser from a web site and stored on your computer's hard drive.&nbsp;
                            Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all&nbsp;
                            cookies or to indicate when a cookie is being sent.&nbsp;
                            We use cookies from third-party partners, such as&nbsp;
                            <a href="www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer">Google Analytics</a>,&nbsp;
                            {/* TODO: disclose ALL information collected! be specific. How do you share info? How do you use it? what do you use? */}
                            to track how you use this website so we can improve this website in the future.&nbsp;
                            However, if you do not accept cookies, you may not be able to use some portions of our Site.&nbsp;
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Security
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            The security of your Personal Information is important to us, but remember that no method of transmission over the Internet,&nbsp;
                            or method of electronic storage, is 100% secure.&nbsp;
                            While we strive to use commercially acceptable means to protect your Personal Information,&nbsp;
                            we cannot guarantee its absolute security.&nbsp;
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Changes to this privacy policy
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            This Privacy Policy is effective as of <b>{LAST_UPDATED_DATE}</b> and will remain in effect&nbsp;
                            except with respect to any changes in its provisions in the future,&nbsp;
                            which will be in effect immediately after being posted on this page.&nbsp;
                            We reserve the right to update or change our Privacy Policy at any time and&nbsp; 
                            you should check this Privacy Policy periodically. Your continued use of the Service&nbsp; 
                            after we post any modifications to the Privacy Policy on this&nbsp;
                            page will constitute your acknowledgment of the modifications and your consent&nbsp; 
                            to abide and be bound by the modified Privacy Policy.&nbsp;
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Contact us
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            If you have any questions about this Privacy Policy, please&nbsp;
                            <a href="mailto: sexytofu.info@gmail.com">contact us</a>.
                        </Typography>
                    </DialogContentText>
                </DialogContent>
          </Dialog>
        )
    }
}

export default withStyles(styles)(Footer);
