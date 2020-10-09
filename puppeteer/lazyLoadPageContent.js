const { takeScreenshot } = require("../puppeteer/takeScreenshot");
const { dumpHTML } = require("../puppeteer/dumpHTML");
const { countTagChildrens } = require("../puppeteer/countTagChildrens");
const { scrollDownPage } = require("../puppeteer/scrollDownPage");
const { hasTagAttribute } = require("../puppeteer/hasTagAttribute");
const { retry } = require("../utils/retry");

//TODO: implement debugging flag for this script
// there is many edge cases here so might be usefull.

async function dumpingVideoListHtml(page) {
  console.log("[ DEBUG ] Dumping list's HTML part for You:");
  const selectorListVideos = "#primary";
  await dumpHTML(page, selectorListVideos);
}

// It depends on spinner tag which is active or not.
const spinnerSelector =
  "#continuations > yt-next-continuation > paper-spinner#spinner.style-scope.yt-next-continuation";

function isSpinnerStillSpinnin_FactoryFn(page) {
  // factory function for retry.js
  return async function isSpinnerStillSpinnin() {
    return await hasTagAttribute(page, spinnerSelector, "active");
  };
}

async function lazyLoadPageContent({ page, scriptName }) {
  let countScroll = 1;
  let conntinueSrollDown = true;
  while (conntinueSrollDown) {
    const selectorVideoListParent =
      "ytd-playlist-video-list-renderer > #contents";
    const videosCount = await countTagChildrens(page, selectorVideoListParent);

    const selectorScrollTarget =
      "ytd-playlist-video-list-renderer > #contents > ytd-playlist-video-renderer:last-child";
    await scrollDownPage(page, selectorScrollTarget);
    // Need some delay to get spinner start
    await page.waitForTimeout(500);

    // Need some delay to get spinner run
    // and load some stuff
    const spinnerIsOff = await retry({
      promiseFactory: isSpinnerStillSpinnin_FactoryFn(page),
      successCondition: (res) => !res,
      retryCount: 10,
      timeout: 100,
    });
    // uncomment for debugging
    // if (spinnerIsOff === false) {
    //   await dumpingVideoListHtml(page);
    // }

    const videosCountAfterLoad = await countTagChildrens(
      page,
      selectorVideoListParent
    );
    if (videosCountAfterLoad == videosCount) {
      // terminate the while loop
      conntinueSrollDown = false;
    }

    console.log(
      `[ SRCOLLDOWNPAGE ] vids no.: ${videosCountAfterLoad}; scrolled: ${countScroll}; need more?: ${conntinueSrollDown}`
    );

    await takeScreenshot({
      skip: true,
      page,
      scriptName,
      baseName: "scroll",
      fullPage: false,
      mute: true,
    });

    countScroll++;
  }
}

module.exports = { lazyLoadPageContent };
