const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { readJson } = require("../utils/readJson");

require("dotenv").config();

const tokensFilePath = "./.secrets/tokens.json";
const clientSecretFilePath = "./.secrets/client_secret.json";

function serviceAPI(service, params) {
  return service.playlists.list(params);
}

const params = {
  part: ["snippet,contentDetails"],
  maxResults: 50,
  // channelId: process.env.CHANNEL_ID,
  mine: true,
};

async function lsPlaylists(response) {
  console.log(`Ls playlists for channel id: ${params.channelId}`);
  const channels = response.data.items;
  if (channels.length == 0) {
    console.log("No channel found.");
  } else {
    console.log(`There is playlists: ${response.data.pageInfo.totalResults}`);
    console.log("The list of playlists is:");
    channels.forEach((itm) => {
      console.log(
        " - %s - '%s', and it has %s items ",
        itm.id,
        itm.snippet.title,
        itm.contentDetails.itemCount
      );
    });
  }
}

async function runRequest(auth, serviceAPI, params, cb) {
  const paramsWithAuth = { ...params, auth };
  const service = google.youtube("v3");
  try {
    const response = await serviceAPI(service, paramsWithAuth);
    cb(response);
  } catch (error) {
    console.log("The API returned an error: " + error + "\n" + error.stack);
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
    runRequest(oauth2Client, serviceAPI, params, lsPlaylists);
  } catch (error) {
    console.error(error);
  }
})();
