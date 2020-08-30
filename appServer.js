'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

const HOST_PORT = "20200"

/* Third party libraries */
const express = require('express');

/* Get Routing modules */
const route = require("./route");

const app = express();

/* Configure routes for the application */
app.use('/api/user', route);

// always invoked if no other routes serve the request.
app.use((req, res) => {
    console.log('error :: --> ', 'Request ' + req.path + ' could not be handled by any existing routes.');
    res.status(500).send('Invalid API Access Request');
});

/* Catch-all error handler for express */
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.log('error  :: --> ', 'Server errorHandler Function :' + err.message);
    res.status(500);
    res.send('Error: ' + err.message);
}

app.use(errorHandler);

// Start the express App and listen on port 202002
app.listen(HOST_PORT);
console.log('info :: -->', '*********** Application Server is listening on Port ' + HOST_PORT + ' ***********');