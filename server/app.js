const express = require('express');
const { testDBConnection } = require('./services/sequelize');
const { errorHandler } = require('./errors/errorhandler');

const authRouter = require('./routes/auth.route');
const accountRouter = require('./routes/account.route');
const categoryRouter = require('./routes/category.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);
app.use('/api/category', categoryRouter);
app.use(errorHandler);

testDBConnection();

module.exports = app;