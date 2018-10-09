import React from "react";
import ReactDOM from "react-dom";

import MainApp from "./MainApp";
import config from "./aws-exports"
import Amplify from "aws-amplify"
Amplify.configure(config);

const rootEl = document.getElementById('app-site');

// Create a reusable render method that we can call more than once
let render = () => {
    // Dynamically import our main App component, and render it
    const MainApp = require('./MainApp').default;
    ReactDOM.render(
        <MainApp/>,
        rootEl
    );
};

if (module.hot) {
    module.hot.accept('./MainApp', () => {
        const NextApp = require('./MainApp').default;
        render(
            <NextApp/>,
            rootEl
        );
    });
}

render();