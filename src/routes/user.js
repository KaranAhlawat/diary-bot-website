"use strict";
exports.__esModule = true;
var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_SERVER, {
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
    Entry: []
});
var User = mongoose.model("User", userSchema, "UserEntry");
// routes to /user. This is the main page the user sees after authenticating.
router
    .route("/")
    .get(function (req, res) {
    var userId = req.query.uid;
    var date = null;
    if (req.query && req.query.d) {
        date = req.query.d;
    }
    User.findById(userId, function (err, userInfo) {
        if (err) {
            console.log(err);
            res.send("/error/unregistered");
        }
        else {
            if (date !== null) {
                var checkDate_1 = new Date(date).toLocaleDateString();
                res.render("user", {
                    uid: userId,
                    uname: userInfo.username,
                    entries: userInfo.Entry.filter(function (item) {
                        var itemDate = Object.keys(item)[0];
                        var extractedDate = new Date(itemDate).toLocaleDateString();
                        return extractedDate === checkDate_1;
                    })
                });
            }
            else {
                res.render("user", {
                    uid: userId,
                    uname: userInfo.username,
                    entries: userInfo.Entry
                });
            }
        }
    });
})
    .post(function (req, res) {
    var date = encodeURIComponent(req.body.selectedDate);
    var paramId = req.query.uid;
    res.redirect("/user?uid=".concat(paramId, "&d=").concat(date));
});
router.get("/entry/:entryId", function (req, res) {
    var entryId = req.params.entryId;
    var paramId = req.query.uid;
    User.findById(paramId, function (err, post) {
        if (err) {
            console.error(err);
        }
        else {
            res.render("post", {
                posts: post.Entry.filter(function (item) {
                    return Object.keys(item)[0] === entryId;
                })
            });
        }
    });
});
module.exports = router;
