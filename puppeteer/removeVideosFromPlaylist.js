const truncate = require("cli-truncate");
const { getTagOuterText } = require("./getTagOuterText");
const { countTagChildrens } = require("../puppeteer/countTagChildrens");
// const { takeScreenshot } = require("../puppeteer/takeScreenshot");

async function removeVideosFromPlaylist(page) {
  const selectorVideoListParent =
    "ytd-playlist-video-list-renderer > #contents";
  const videosCount = await countTagChildrens(page, selectorVideoListParent);

  console.info(` About to remove: ${videosCount} ...`);
  let videoNo = 1;
  while (videoNo <= videosCount) {
    const selectorVideo = `ytd-playlist-video-list-renderer > #contents > ytd-playlist-video-renderer:nth-child(1)`;

    // get video's info for logging
    const selectorVideoTitle = `${selectorVideo} #video-title`;
    const selectorVideoChannelName = `${selectorVideo} #channel-name #text`;
    const videoTitle = await getTagOuterText(page, selectorVideoTitle);
    const videoChannelName = await getTagOuterText(
      page,
      selectorVideoChannelName
    );

    // open video's 3 dots menu
    const selectorVideosDot3Button = selectorVideo + " #button";
    const selector3DotMenuPopup = "ytd-popup-container iron-dropdown[focused]";
    const button3Dots = await page.$(selectorVideosDot3Button);
    await button3Dots.click();
    await page.waitForSelector(selector3DotMenuPopup);

    // find in 3 dots menu witch item is 'Remove From...'
    const selector3DotMenuParent =
      "ytd-popup-container #items > ytd-menu-service-item-renderer";

    async function getRemoveFromButtonPosition(page, selector) {
      return await page.$$eval(selector, (node) => {
        function checkIfRemoveFromItem(itmOuterText) {
          return itmOuterText.trim().slice(0, 11) === "Remove from"
            ? true
            : false;
        }
        const nodeList = [...node];
        const match = nodeList.reduce((acc, curr, idx) => {
          if (checkIfRemoveFromItem(curr.outerText)) {
            return [...acc, idx + 1]; // html childrens is not 0-indexed
          } else {
            return [...acc];
          }
        }, []);
        if (typeof match[0] !== "number") {
          return null;
        } else {
          return match[0];
        }
      });
    }

    const itemRemoveFromPosition = await getRemoveFromButtonPosition(
      page,
      selector3DotMenuParent
    );

    // click remove from
    const selectorRemoveFromButton = `ytd-popup-container #items > ytd-menu-service-item-renderer:nth-child(${itemRemoveFromPosition}) paper-item`;
    // differs between WL playlist and the others
    // for WL is - 3
    // for the other rest is - 4
    const buttonRemoveFrom = await page.$(selectorRemoveFromButton);
    await buttonRemoveFrom.click();
    await page.waitForTimeout(500);

    // logging part
    const videoInfoNo = ` - vid no. ${videoNo}:`;
    const videoInfoTitle = `- ${videoChannelName} - ${truncate(
      videoTitle,
      30
    )}`;
    console.log(`${videoInfoNo} [ DELETED ] video: ${videoInfoTitle}`);
    videoNo++;
  }
}

module.exports = { removeVideosFromPlaylist };
