const { google } = require("googleapis");
const { writeFile } = require("./utils/writeFile");

const express = require("express");
const server = express();
const port = 3000;
const tokensFilePath = "./oauth2Client.json";

require("dotenv").config();

// credentials from google oauth service
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log("Credentials:   ");
console.log(" id     ---->", clientId);
console.log(" secret ---->", "*".repeat(clientSecret.length));

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  "http://localhost:3000/callback" // oauth callback url
);
google.options({ auth: oauth2Client });

const scope = "https://www.googleapis.com/auth/youtube";
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope,
});

const app = (server) => {
  // Initial page redirecting to YT
  server.get("/auth", (req, res) => {
    console.log(" authorizeUrl    ---->", authorizeUrl);
    res.redirect(authorizeUrl);
  });

  // Sucess page
  // need to redirect here becouse refreshing /callback cause error
  server.get("/success", (req, res) => {
    return res
      .status(200)
      .send(
        `Tokens acquired and saved to the file: ${tokensFilePath} <br> Click in the link to close the server.<br><a href="/close">Close Server</a>`
      );
  });

  server.get("/close", (req, res) => {
    setTimeout(function () {
      process.exit(0);
    }, 2000);
    return res.status(200).send("Closing...");
  });

  // Callback service parsing the authorization token and asking for the access token
  server.get("/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
      console.log("The resulting token: ", tokens);
      await writeFile(tokensFilePath, JSON.stringify(oauth2Client, null, 2));
      res.redirect("/success");
    } catch (error) {
      console.error("Access Token Error", error);
      return res.status(500).send("Authentication failed");
    }
  });

  // Landing page
  server.get("/", (req, res) => {
    res.send(
      'Get YT tokens. Click in the link to log in.<br><a href="/auth">Log in with YT</a>'
    );
  });
};

const runServer = (app) => {
  const serverInstance = server.listen(port, (err) => {
    if (err) return console.error(err);
    console.log(`Express server listening at http://localhost:${port}`);
    return app(server);
  });
};

runServer(app);

