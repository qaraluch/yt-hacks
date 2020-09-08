# yt-hacks

## Dependencies installation

Install dependencies with npm package manager:

```
npm install

```

List of dependencies:

- googleapis
- dotenv
- express
- prompt-confirm

## Authorization  

### Get token

You need to acquire Google's Oauth2 tokens to run further scripts.
Run script: `getTokens.js` to create OAuth2 credentials object and save it
as JSON `oauth2Client.json` file.

Before getting tokens you need create `.env` file and save in it Google's CLIENT_ID, CLIENT_SECRET information.
You can find these pieces of information by going to the [Developer Console][https://console.cloud.google.com/apis/credentials], clicking your project --> APIs & auth --> credentials.
Use `.env.example` as a template.

Then run command:

```
node getTokens.js
```

It will create a web server, so you can go to the address: `http://localhost:3000` in the browser.
Follow instructions on the web page.

References: [1], [2], [3].

### List all playlists

Run command:

```
node lsPlaylists.js
```

#### WIP

Example from:
[Node.js Quickstart  |  YouTube Data API  |  Google Developers](https://developers.google.com/youtube/v3/quickstart/nodejs)
Inna froma autentykacji.
by package:
install it:

```
npm install google-auth-library --save
```

Download client_secret.json form [Developer Console][https://console.cloud.google.com/apis/credentials].
It is used for user authentication.

### Copy playlist

Run command:

```
node copyPlaylist.js <nameSource> <nameDestination>
node copyPlaylist.js  xxx-api-test xxx-api-test2
```

## TODOs:

- [x] get tokens
- [ ] ls your playlists
- [ ] copy playlist

## Resources:

- [1] YT api [API Reference  |  YouTube Data API  |  Google Developers](https://developers.google.com/youtube/v3/docs/)
- [2] node.js - googleapis package [googleapis/google-api-nodejs-client: Google's officially supported Node.js client library for accessing Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT (Service Tokens) is included.](https://github.com/googleapis/google-api-nodejs-client#getting-supported-apis)
- [3] oauth2 code sample [google-api-nodejs-client/oauth2.js at master · googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/oauth2.js)

