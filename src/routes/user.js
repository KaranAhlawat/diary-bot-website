"use strict";
exports.__esModule = true;
var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://Karan:DqFZv45zzXeRVz6@diary-db.3fg7h.mongodb.net/Entry", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var userSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    username: {
        type: String,
        required: true
    },
    entries: [
        {
            content: String,
            timestamp: Date
        },
    ]
});
var User = mongoose.model("User", userSchema, "UserEntry");
// routes to /user. This is the main page the user sees after authenticating.
router
    .route("/")
    .get(function (req, res) {
    var userId = req.query.uid;
    var date = "";
    if (req.query && req.query.d) {
        date = req.query.d;
        User.find({ _id: userId }, function (err, userInfo) {
            if (err) {
                console.log(err);
                res.send("/error/unregistered");
            }
            else {
                res.render("user", {
                    uid: userId,
                    uname: userInfo.username,
                    entries: userInfo.entries
                });
            }
        });
    }
    console.log(userId);
    console.log(date);
    User.findById(userId, function (err, userInfo) {
        if (err) {
            console.log(err);
            res.send("/error/unregistered");
        }
        else {
            res.render("user", {
                uid: userId,
                uname: userInfo.username,
                entries: userInfo.entries
            });
        }
    });
})
    .post(function (req, res) {
    var date = encodeURIComponent(req.body.selectedDate);
    var paramId = req.query.uid;
    res.redirect("/user?uid=" + paramId + "&d=" + date);
});
module.exports = router;
