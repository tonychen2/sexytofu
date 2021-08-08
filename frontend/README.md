## Overview
The web app is written in the [React](https://reactjs.org/) framework and the [Material UI](https://material-ui.com/) library for styling.


## Getting started
We use npm to manage JavaScript packages, which depends on and distributes with Node.js, 
so the first step is to download and install [Node.js](https://nodejs.org/en/download/).

Then, open a new command line session, navigate to this directory, and install all requirements by:
```
npm install package.json
```

To get the frontend running, simply execute
```
npm start
```

After you see `Server running at http://localhost:1234`, you are ready to go!

To access the user-facing page, go to http://localhost:1234/index.html

To access the recommendation management portal (currently support Chrome only), go to http://localhost:1234/addReco/addReco.html

*Note that to use all features, the backend also needs to be running. See [../backend/README.md](../backend/README.md) for details*


## Google Analytics setup
We have [GA4](https://support.google.com/analytics/answer/10089681?hl=en) set up to track user engagement, and custom [events](https://support.google.com/analytics/answer/9322688?hl=en) are defined through [Google Tag Manager](https://support.google.com/tagmanager/answer/6102821?hl=en) to allow for easy management and maximum extensibility.

Within the GA "Sexy Tofu" property, we have two different data streams for our two environments: Web (for prod) and Dev/QA, each with its own *Measurement ID* that is used in the "GA4 Configuration" tag in GTM to connect GTM and GA.

Accordingly, there are also corresponding "environments" in GTM differing in the GA Measurement ID used, then each with its own *GTM_AUTH* and *GTM_PREVIEW* that are set as environment variables in the frontend server (via AWS Amplify), which are pick up by the code to send data to GTM.

These configs all need to be checked for when new environments or new deployment schemes are created, in order for the different pieces to work together to track the right environment. 