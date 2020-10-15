# yt-hacks

Quick and dirty Node.js scripts to interact with YT API.

## Settings

Set up global settings like port number for servers and so on in `.env` file. Use `.env.example` as a template.

## Dependencies installation

Clone the repo and install dependencies with npm package manager:

```
npm install
```

List of app dependencies:

- googleapis
- dotenv
- express
- prompt-confirm

Other dependencies:

- docker
  - puppeteer

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

References: [4], [5].

## List all playlists

Get list of all your playslist and its id, name and items in it.

Run command:

```
node src/lsPlaylists.js
```

## Take screenshot of main YT page

There is used a dockerized puppeteer.js for this task.

1. Install docker and build an image by:

```
./build.sh
```

or

```
docker build -t puppeteer-img .
```

2. run container:

```
./run.sh
```

or

```
sudo docker run \
  -it \
  --init \
  --rm \
  --cap-add=SYS_ADMIN \
  -v $(pwd):/home/node/app \
  --workdir /home/node/app \
  puppeteer-img \
  bash
```

It will switch to the container shell:

3. run commands:

```
npm run screenshot
```

or

```
node src/screenshot.js
```

The screenshot of the web page will be saved to the `Downloads` dir in the host's CWD.

References: [6].

## Sign in to the YT service

And take screenshot of the YT page behind login.
For this task it is used puppeteer script: `signInYT.js`

Run following command to see results of this scrip:

```
npm run login
```

or

```
node src/loginYT.js
```

References: [7], [8].

## Lazy load all videos' content on the page

In order to make operations on the Watch Later list you need to lazy load all content on the page.
For this task it is used puppeteer script: `lazyLoadPageContent.js`

Run following command to see results of this scrip:

```
npm run scroll-down
```

or

```
node src/scrollDownWL.js
```

## Copy videos form WL playlist to another (backup)

After load all videos for WL playlist you can backup videos to another playlist now.
For this task it is used puppeteer script: `copyVideosBetweenPlaylists.js`

Run following command to see results of this scrip:

```
npm run backup-wl
```

or

```
node src/backupWL.js
```

References: [10].

## TODOs:

- [ ] wipe out WL list
- [ ] get all your subscriptsions and save it to the lists repo

## Resources:

- [1] YT api docs [[API Reference on Google Developers](https://developers.google.com/youtube/v3/docs/)]
- [2] node.js - googleapis package [[googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client#getting-supported-apis)]
- [3] oauth2 code sample [[googleapis/google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/oauth2.js)]
- [4] yt example code - node.js quickstart [[google developers](https://developers.google.com/youtube/v3/quickstart/nodejs)]
- [5] how to get the correct parameters for the googleapi-nodejs-client [[Stack Overflow](https://stackoverflow.com/questions/61749543/how-to-get-the-correct-parameters-for-the-googleapi-nodejs-client/61763636#61763636)]
- [6] running puppeteer in docker [[puppeteer/troubleshooting.md](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker)]
- [7] Couldn't sign you in Google account login fails in headless mode [[Issue #4871 · puppeteer/puppeteer](https://github.com/puppeteer/puppeteer/issues/4871)]
- [8] puppeteer-extra-plugin-stealth [[puppeteer-extra/packages](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)]
- [9] scroll down until you can't anymore [[Stack Overflow](https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore)]
- [10] puppeteer documentation [[Puppeteer](https://pptr.dev/)]
