const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const { accountsRoutes } = require('./src/routes');

app.use('/api/accounts', accountsRoutes);

app.listen(3000, () => console.log('App is listening on http://localhost:3000/'));
