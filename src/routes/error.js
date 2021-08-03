"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
router.get('/unregistered', function (req, res) {
    res.render('error');
});
module.exports = router;
