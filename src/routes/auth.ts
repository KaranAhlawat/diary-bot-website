// Package imports
import express = require("express"); // for router
import fetch = require("node-fetch"); // for making fetch request to discord api.
const DiscordOAuth2 = require("discord-oauth2"); // for getting user token and info. token fetch api is broken, need to use node-fetch to make a POST request directly.

// Initialize new router
const router = express.Router();
// setting oauth params for the app.
const oauth = new DiscordOAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CLIENT_REDIRECT,
});

const currentDate = new Date();

// routes to /auth. gives the user a discord authentication link, generated dynamically
router.get("/", (req: express.Request, res: express.Response) => {
  res.render("auth", {
    url: oauth.generateAuthUrl({ scope: ["identify"] }),
    year: currentDate.getFullYear(),
  });
});

// routes to /auth/redirect.
router.get("/redirect", async (req: express.Request, res: express.Response) => {
  // get the code returned when we redirect after user authenticates the application.
  const { code } = req.query;
  let oauthResult;
  try {
    // Use node-fetch to make a POST request to the Discord API and exchange the code for an access token.
    oauthResult = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code.toString(),
        grant_type: "authorization_code",
        redirect_uri: process.env.CLIENT_REDIRECT,
        scope: "identify",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (e) {
    console.error(e);
  }

  try {
    // Parse the response by the API into json
    const oauthData = await oauthResult.json();

    // use the access token returned in the response to get user info, like username and user id. After that redirect to the /user page.
    const discordInfo = await oauth.getUser(oauthData.access_token);

    res.redirect(`/user?uid=${discordInfo.id}`);
  } catch (e) {
    console.error(e);
    res.send("Uh-oh! Something went wrong, try again later :/");
  }
});

module.exports = router;
