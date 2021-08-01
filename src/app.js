"use strict";
exports.__esModule = true;
// Package imports
require('dotenv').config();
var express = require("express");
// project and env variables imports.
var PORT = process.env.PORT;
var authRoute = require('./routes/auth');
var userRoute = require('./routes/user');
var errorRoute = require('./routes/error');
// creat an express app
var app = express();
// setting various options and middleware routes for the app
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('src/public'));
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/error', errorRoute);
var currentDate = new Date();
// root get and post
app.get('/', function (req, res) {
    res.render('index', { year: currentDate.getFullYear() });
});
app.get('/contact', function (req, res) {
    res.render('contact');
});
app.get('/setup', function (req, res) {
    res.render('setup-instructions');
});
app.listen(PORT, function () {
    console.log("Running on port :" + PORT);
});
