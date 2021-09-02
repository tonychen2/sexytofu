import React, { Component } from 'react';
import  "regenerator-runtime";
import {getCookieConsentValue, Cookies} from "react-cookie-consent";  

import {Grid} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import {withStyles} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const styles = {
    root: {
        rowGap: '50px',
        padding: '50px 100px',
        '@media only screen and (max-width: 600px)': {
            padding: '50px 20px',
        },
        '& a:link' : {
            color: '#851fff',
        },
        '& a:visited': {
            color: '#cc00aa',
        },
        '& a:link:hover': {
            backgroundColor: '#e6d1ff',
            color: '#6c00ed',
        },
        '& a:visited:hover': {
            backgroundColor: '#ffdbec',
            color: '#99007f',
        },
    },
};


class PrivacyPolicyApp extends Component {
    /**
     * Top-level React class component for the main body of the Privacy Policy.
     *
     * @param   {Object}  classes  Style of the component
     */
    constructor(props){
        super(props);
        this.state = {
            isConsent : (getCookieConsentValue() === 'true')
        }
    }    

    handleChange = () => {
        // Sets cookie according to checkbox.
        // NOTE: setState is asynchronous, so storing the value in a variable allows both cookies and state to be set to the same value.
        // https://stackoverflow.com/questions/32923255/react-checkbox-doesnt-toggle
        const consent = !this.state.isConsent;
        this.setState({isConsent: consent});
        Cookies.set("CookieConsent", consent, { expires: 365 });
        // TODO: change google tag manager tracking WITHOUT having to reload the page. (communication between this and index.html?)
    }

    render () {
        // Override global themes for Typography. TODO: place in separate imported doc. like index.css, import same as App.js
        const theme = createMuiTheme({
        typography: {
            h3: {
                fontFamily: ['Lato', 'sans-serif'],
                fontWeight: 'bolder',
                fontSize: '1.5rem',
                color: 'white',
            },
            h5: {
                fontFamily: ['Lato', 'sans-serif'],
                fontWeight: 'bold',
                color: 'white',
            },
            body2: {
                fontFamily: ['Lato', 'sans-serif'],
                fontWeight: 'normal',
                fontSize: '1.2rem',
            }
        }
        });

        const LAST_UPDATED_DATE = "August 28 2021";
        return (
            <MuiThemeProvider theme={theme}>
            <Grid container id="container" className={this.props.classes.root}>
                <Grid item xs={12} id="input">
                        <Typography variant="h3" align="center" style={{color: "#322737"}}> 
                            Privacy Policy
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                        Last updated: <b>{LAST_UPDATED_DATE}</b>
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            <b>Sexy Tofu</b> operates <a href="https://www.sexytofu.org/" target="_blank" rel="noopener noreferrer">https://www.sexytofu.org/</a> (the "Site").
                            This privacy policy informs you of our policies regarding the collection, use and disclosure of
                            personal information we receive from users of the Site.
                            We use your personal information only for providing and improving the Site. By using the Site, you
                            agree to the collection and use of information in accordance with this policy.
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Cookies
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            Cookies are small files of data, which may include an anonymous unique identifier.
                            Cookies are sent to your browser from a web site and stored on your computer's hard drive.
                            Like many sites, we use "cookies" to collect information about your activities
                            in our services, which may include:
                            <ul>
                                <li> Foods you search for</li>
                                <li> Recommendations you apply</li>
                                <li> Number of people and length of time your grocery list is for </li>
                            </ul>
                            We use cookies from third-party partners, such as&nbsp;
                            <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer">Google Analytics</a>,&nbsp;
                            to track how you use this website so we may improve this website in the future.
                            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            The amount of information provided by you is voluntary.
                            However, if you do not accept cookies, you might not be able to use some parts of our Site.
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Your Data
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            Please note <b>Sexy Tofu</b> takes privacy seriously. Data collected is used for internal purposes only.
                            We do not sell or rent information about you.
                            We do not share or disclose your personal information and data to
                            third parties without your consent, except as explained in this Privacy Policy.
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Compliance with Laws
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            <b>Sexy Tofu</b> cooperates with the law and government officials to comply with the law. We may disclose
                            information about you if we deem it reasonably necessary to:
                            <ol type="a">
                                <li> Satisfy relevant laws or regulations</li>
                                <li> Enforce Terms of Use, including investigations of potential violations</li>
                                {/* TODO: a Terms of Use, and link here */}
                                <li> Detect, prevent, and address fraud, security, or technical issues</li>
                                <li> Protect the rights, safety, and property of this company, its users, or the public</li>
                            </ol>
                            as required or permitted by law.
                            Your data is subject to the laws of the United States of America regardless of where the data originates.
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Security
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            The security of your personal information is important to us, but remember that no method of transmission over the internet,
                            or method of electronic storage, is always completely secure.
                            While we strive to use commercially acceptable means to protect your Personal Information,
                            we cannot guarantee its absolute security.
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Changes to this privacy policy
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            This Privacy Policy is effective as of <b>{LAST_UPDATED_DATE}</b> and will remain in effect
                            except with respect to any changes in its provisions in the future,
                            which will be in effect immediately after being posted on this page.
                            We reserve the right to update or change our Privacy Policy at any time and
                            you should check this Privacy Policy periodically. Your continued use of the Service
                            after we post any modifications to the Privacy Policy on this
                            page will constitute your acknowledgment of the modifications and your consent
                            to abide and be bound by the modified Privacy Policy.
                        </Typography>
                        <Typography component={'span'} variant="h3" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                            Contact us
                        </Typography>
                        <Typography component={'span'} variant="body2" display="block" align="left" style={{marginBottom: '1rem'}}>
                            If you have any questions about this Privacy Policy, please&nbsp;
                            <a href="mailto: sexytofu.info@gmail.com">contact us</a>.
                        </Typography>
                </Grid>
                {/* Only show if already accepted/declined cookie values in banner. */}
                {(getCookieConsentValue() !== undefined) && <Grid item xs={12} id="change-cookie-preference">
                    <Typography
                        align='center'
                        variant='h3'
                        color='textPrimary'>
                        Change your cookie preferences
                    </Typography>
                    <Typography component={'span'} variant="body2" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                        You can update your cookie preference here.
                        You have previously {this.state.isConsent ? "accepted" : "declined"} cookies. 
                    </Typography>
                    <Typography component={'span'} variant="body2" display="block" align="left" style={{color: "#322737", marginBottom: '1rem'}}>
                        <Switch
                            checked={this.state.isConsent}
                            onChange={this.handleChange}
                            name="cookie-consent-switch"
                            inputProps={{ 'aria-label': 'cookie consent checkbox' }}
                        />
                        Accept cookies?
                    </Typography>
                </Grid>
                }
            </Grid>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(PrivacyPolicyApp);