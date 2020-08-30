'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

const httpHelper = require('./httpHelper');
const fs = require('fs');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// aws config details
const userPoolId = '<User Pool ID>';
const clientId = '<App Client ID>';

const poolData = {
    UserPoolId : userPoolId,
    ClientId : clientId
};


exports.login = (req, res) => {

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const authenticationData = {
        Username : req.body.email,
        Password : req.body.password,
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    const userData = {
        Username : req.body.email,
        Pool : userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async function (result) {
            //logged in successfully through AWS cognito authentication.
            let responseDataObject = {};

            const idToken = result.getIdToken().getJwtToken();

            responseDataObject.loginSuccessMessage = "Logged In Successfully!";
            responseDataObject.sessionToken = idToken;

            //fetch nginx Logs
            const nginxLogs = await readLog(req.body.filterKey);

            if (nginxLogs.length <= 0) {
                responseDataObject.logsMessage = "Filter key matching nginx logs not found!"
            } else {
                responseDataObject.logs = nginxLogs;
            }

            httpHelper.sendResponse(res, null, responseDataObject);
        },

        onFailure: function(err) {
            httpHelper.sendResponse(res, err);
        },

    });
};

const readLog = (filterKey) => {
    const logFile = '/var/log/nginx/access.log';
    return new Promise((resolve, reject) => {
        fs.readFile(logFile, 'utf8', (err, contents) => {
            if(err) { reject(err); }

            const recentFirstLogs = contents.toString().split(/\n/).reverse();

            const filteredLogs = recentFirstLogs.filter(log => log.toString().includes(filterKey.toString()));
            resolve(filteredLogs);
        });
    });
};