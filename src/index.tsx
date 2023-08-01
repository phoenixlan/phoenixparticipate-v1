/*
 * @created 27/03/2021 - 20:11
 * @project phoenixparticipate-v1
 * @author andreasjj
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { init } from '@phoenixlan/phoenix.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import * as Sentry from '@sentry/react';

const initialize = () => {
    if (process.env.BASE_URL) {
        init(process.env.BASE_URL);
        if (process.env.REACT_APP_SENTRY_DSN) {
            console.log('Sentry initialized');
            Sentry.init({
                dsn: process.env.REACT_APP_SENTRY_DSN,
            });
        }
    } else {
        throw Error('BASE_URL is not defined');
    }
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
    initialize,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
