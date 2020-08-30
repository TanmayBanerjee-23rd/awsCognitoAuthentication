'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

exports.sendResponse = (res, err, data) => {

    let responseString;

    if (err) {
        responseString = {
            success: false,
            data: {},
            error: {
                message: err.message
            }
        }
    } else {
        responseString = {
            success: true,
            data: data
        }
    }
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(responseString, null, 2));

};