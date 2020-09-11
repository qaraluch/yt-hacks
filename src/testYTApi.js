const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { readJson } = require("../utils/readJson");

const tokensFilePath = "./.secrets/tokens.json";
const clientSecretFilePath = "./.secrets/client_secret.json";

async function testYTApi(auth) {
  const service = google.youtube("v3");
  const params = {
    auth: auth,
    part: "snippet,contentDetails,statistics",
    forUsername: "GoogleDevelopers",
  };
  try {
    const response = await service.channels.list(params);
    const channels = response.data.items;
    console.log("Test YT API:");
    if (channels.length == 0) {
      console.log("No channel found.");
    } else {
      console.log(
        "This channel's ID is %s. Its title is '%s', and " + "it has %s views.",
        channels[0].id,
        channels[0].snippet.title,
        channels[0].statistics.viewCount
      );
    }
  } catch (error) {
    console.log("The API returned an error: " + err);
    return;
  }
}

(async function run() {
  try {
    const credentialsLoaded = await readJson(clientSecretFilePath);
    const clientSecret = credentialsLoaded.installed.client_secret;
    const clientId = credentialsLoaded.installed.client_id;
    const redirectUrl = credentialsLoaded.installed.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    const tokens = await readJson(tokensFilePath);
    oauth2Client.setCredentials(tokens);
    testYTApi(oauth2Client);
  } catch (error) {
    console.error(error);
  }
})();
