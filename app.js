const express=require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes=require('./routes/user');
const sauceRoutes=require('./routes/sauce');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://tester:saNmrfukI9ZOQDlm@andela-1dp2d.mongodb.net/test?retryWrites=true')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');

        console.error(error);
    });

// This will allow all requests from all origins to access your API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// set json function as global middleware
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth',userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app