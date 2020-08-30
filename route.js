'use strict';
/*jslint node: true */
/*jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json({type: 'application/json'}));

const controller = require('./controller');

router.use('/login', (req, res) => {
    if (req.method === 'POST') {
        controller.login(req, res);
    } else {
        console.log('warn :: -->', req.method + ' ' + req.baseUrl + ' - Request method is not supported.');
        return res.status(405).send({
            message: 'Invalid Request Method'
        });
    }
});

module.exports = router;