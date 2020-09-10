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

Before getting tokens you need get and save your credentials as `clinet_secret.json` file in the `./.secrets/` dir.
You can find these pieces of information by going to the [Developer Console][https://console.cloud.google.com/apis/credentials],
clicking your project --> APIs & auth --> credentials and download it.

Run script:

```
node src/getTokens.js
```

to create OAuth2 credentials object and save it
as JSON `./.secrets/tokens.json` file.

It will create a web server, so you can go to the address: `http://localhost:3000` in the browser.
Follow instructions on the web page.

References: [1], [2], [3].

## Test YT API

If you setup correctly credentials and got your tokens, you can test YT API response using following script.

Run script:

```
node src/testYTAPI.js
```

References: [4].

## TODOs:

- [x] get tokens
- [x] test YT API
- [ ] ls your playlists
- [ ] copy playlist

## Resources:

- [1] YT api [API Reference  |  YouTube Data API  |  Google Developers](https://developers.google.com/youtube/v3/docs/)
- [2] node.js - googleapis package [googleapis/google-api-nodejs-client: Google's officially supported Node.js client library for accessing Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT (Service Tokens) is included.](https://github.com/googleapis/google-api-nodejs-client#getting-supported-apis)
- [3] oauth2 code sample [google-api-nodejs-client/oauth2.js at master · googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/oauth2.js)
- [4] yt example code [node.js quickstart | youtube data api | google developers](https://developers.google.com/youtube/v3/quickstart/nodejs)
