import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import  "regenerator-runtime";

import TagManager from 'react-gtm-module'

const tagManagerArgs = {
    gtmId: 'GTM-K6GPKTV',
    auth: process.env.GTM_AUTH,
    preview: process.env.GTM_PREVIEW
};
TagManager.initialize(tagManagerArgs)

ReactDOM.render(<App />, document.getElementById('app'));


