const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { accountsRoutes } = require('./src/routes');

app.use('/api/accounts', accountsRoutes);

module.exports = app;
