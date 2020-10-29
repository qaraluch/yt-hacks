const truncate = require("cli-truncate");
const { getTagOuterText } = require("./getTagOuterText");
const {
  getTagChildrenPositionByOuterText,
} = require("./getTagChildrenPositionByOuterText");
const { countTagChildrens } = require("../puppeteer/countTagChildrens");
// const { takeScreenshot } = require("../puppeteer/takeScreenshot");

async function copyVideosBetweenPlaylists(
  page,
  playlistNameTarget,
  resumeVideoNo = 1
) {
  const selectorVideoListParent =
    "ytd-playlist-video-list-renderer > #contents";
  const videosCount = await countTagChildrens(page, selectorVideoListParent);

  for (let videoNo = resumeVideoNo; videoNo <= videosCount; videoNo++) {
    const selectorVideo = `ytd-playlist-video-list-renderer > #contents > ytd-playlist-video-renderer:nth-child(${videoNo})`;

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

    // click save to playlist
    const selectorSaveToPlaylistButton =
      "ytd-popup-container #items > ytd-menu-service-item-renderer:nth-child(2) paper-item";
    //hardcoded that it is second child item, but layout shouldn't change too match
    const buttonSeaveToPlaylist = await page.$(selectorSaveToPlaylistButton);
    await buttonSeaveToPlaylist.click();
    // selector: "ytd-popup-container paper-dialog #playlists.scrollable"
    // WIP
    // is buggy so waiting:
    // await page.waitForTimeout(500);
    const selectorWaitForSaveToPlaylistPopup =
      "ytd-popup-container paper-dialog #playlists.ytd-add-to-playlist-renderer.scrollable";
    await page.waitForSelector(selectorWaitForSaveToPlaylistPopup);

    // copy video to another PL
    // - get target PL no.
    const selectorAddToPopupList =
      "ytd-popup-container paper-dialog #playlists > ytd-playlist-add-to-option-renderer";
    const playlistTargetPosition = await getTagChildrenPositionByOuterText(
      page,
      selectorAddToPopupList,
      playlistNameTarget
    );
    if (!playlistTargetPosition) {
      console.log(
        `[ ERROR ] Do not found target playlist named: ${playlistNameTarget}`
      );
      // terminate task
      return;
    }

    // copy video to another PL
    // - check if already not copied
    const selectorTargetPLButton = `ytd-popup-container paper-dialog #playlists ytd-playlist-add-to-option-renderer:nth-child(${playlistTargetPosition})`;
    const selectorTargetPLButtonChecked = `${selectorTargetPLButton} paper-checkbox[checked]`;
    const selectorTargetPLButtonNotChecked = `${selectorTargetPLButton} paper-checkbox:not([checked])`;
    const buttonCheckItChecked = await page.$(selectorTargetPLButtonChecked);
    const buttonCheckItNotChecked = await page.$(
      selectorTargetPLButtonNotChecked
    );

    let toSkip = false;
    if (buttonCheckItChecked) {
      toSkip = true;
    }
    if (buttonCheckItNotChecked) {
      await buttonCheckItNotChecked.click();
    }
    // selector is difficult to pinpoint so waiting:
    await page.waitForTimeout(500);

    // close dialog pop-up
    const selectorClosePopup =
      "ytd-popup-container button[aria-label='Cancel']";
    const buttonClosePopup = await page.$(selectorClosePopup);
    await buttonClosePopup.click();

    // logging part
    const videoInfoNo = ` - vid no. ${videoNo}:`;
    const videoInfoTitle = `- ${videoChannelName} - ${truncate(
      videoTitle,
      30
    )}`;
    if (toSkip) {
      console.log(
        `${videoInfoNo} [x] already in: ${playlistTargetPosition}. '${playlistNameTarget}' [ Skipped! ] ${videoInfoTitle}`
      );
    } else {
      console.log(
        `${videoInfoNo} [v] copied to:  ${playlistTargetPosition}. '${playlistNameTarget}'              ${videoInfoTitle}`
      );
    }

    // wait for fade out of closing popup
    await page.waitForTimeout(500);
  }
}

module.exports = { copyVideosBetweenPlaylists };
