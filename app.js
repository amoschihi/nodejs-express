const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

//Import Routes
const productsRoute = require('./routes/products');

const ordersRoute = require('./routes/orders');

app.use(cors({
    origin: "*",
    methods: ['PUT', 'GET', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: 'Content-Type, Authorization, Accept, Origin, x-Requested-With'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Use Routes
app.use('/api/products',productsRoute);

app.use('/api/orders',ordersRoute);

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
