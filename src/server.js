'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./ middleware/500');
const notFoundHandler = require('./ middleware/404');
const authRoutes = require('./auth/router');
const logger = require('./ middleware/logger');

const routesV1 = require('./auth/routes/v1');
const routesV2 = require('./auth/routes/v2');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(logger);

app.get("/", (req, res) => {
    res.send("welcome to our store page");
})

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(authRoutes);
app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

app.use('*', notFoundHandler);
app.use(errorHandler);



module.exports = {
    server: app,
    start: port => {
        if (!port) {
            throw new Error('Missing Port');
        }
        app.listen(port, () => console.log(`Listening on ${port}`));
    },
};