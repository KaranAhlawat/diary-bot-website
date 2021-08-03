"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// Package imports
var express = require("express"); // for router
var fetch = require("node-fetch"); // for making fetch request to discord api.
var DiscordOAuth2 = require("discord-oauth2"); // for getting user token and info. token fetch api is broken, need to use node-fetch to make a POST request directly.
// Initialize new router
var router = express.Router();
// setting oauth params for the app.
var oauth = new DiscordOAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.CLIENT_REDIRECT
});
var currentDate = new Date();
// routes to /auth. gives the user a discord authentication link, generated dynamically
router.get("/", function (req, res) {
    res.render("auth", {
        url: oauth.generateAuthUrl({ scope: ["identify"] }),
        year: currentDate.getFullYear()
    });
});
// routes to /auth/redirect.
router.get("/redirect", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, oauthResult, e_1, oauthData, discordInfo, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                code = req.query.code;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fetch("https://discord.com/api/oauth2/token", {
                        method: "POST",
                        body: new URLSearchParams({
                            client_id: process.env.CLIENT_ID,
                            client_secret: process.env.CLIENT_SECRET,
                            code: code.toString(),
                            grant_type: "authorization_code",
                            redirect_uri: process.env.CLIENT_REDIRECT,
                            scope: "identify"
                        }),
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })];
            case 2:
                // Use node-fetch to make a POST request to the Discord API and exchange the code for an access token.
                oauthResult = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 7, , 8]);
                return [4 /*yield*/, oauthResult.json()];
            case 5:
                oauthData = _a.sent();
                return [4 /*yield*/, oauth.getUser(oauthData.access_token)];
            case 6:
                discordInfo = _a.sent();
                res.redirect("/user?uid=" + discordInfo.id);
                return [3 /*break*/, 8];
            case 7:
                e_2 = _a.sent();
                console.error(e_2);
                res.send("Uh-oh! Something went wrong, try again later :/");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
module.exports = router;
