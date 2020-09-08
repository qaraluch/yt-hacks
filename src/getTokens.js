const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { writeFile } = require("../utils/writeFile");
const { readJson } = require("../utils/readJson");
const express = require("express");
const server = express();

const port = 3000;
const scope = "https://www.googleapis.com/auth/youtube";
const tokensFilePath = "./.secrets/tokens.json";
const clientSecretFilePath = "./.secrets/client_secret.json";
const redirectUrl = "http://localhost:3000/callback"; // oauth callback url

async function readClientSecrets(server, app) {
  const credentialsLoaded = await readJson(clientSecretFilePath);
  const clientId = credentialsLoaded.installed.client_id;
  const clientSecret = credentialsLoaded.installed.client_secret;
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
  console.log("Credentials:   ");
  console.log(" id     ---->", clientId);
  console.log(" secret ---->", "*".repeat(clientSecret.length));
  google.options({ auth: oauth2Client });
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
  });
  server(app, authorizeUrl, oauth2Client);
}

const app = (server, authorizeUrl, oauth2Client) => {
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
    return res.status(200).send("It's done. Server closed!");
  });

  // Callback service parsing the authorization token and asking for the access token
  server.get("/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      // oauth2Client.setCredentials(tokens); //no need, just for reference
      console.log("Saving tokens to the file: ", tokensFilePath, " ...");
      await writeFile(tokensFilePath, JSON.stringify(tokens, null, 2));
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

const runServer = (app, authorizeUrl, oauth2Client) => {
  const serverInstance = server.listen(port, (err) => {
    if (err) return console.error(err);
    console.log(`Express server listening at http://localhost:${port}`);
    return app(server, authorizeUrl, oauth2Client);
  });
};

readClientSecrets(runServer, app);
