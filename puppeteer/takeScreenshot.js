//Puppeteer util
async function takeScreenshot({
  skip = false,
  page,
  scriptName,
  baseName,
  wait = 0,
  fullPage = false,
  mute = false,
}) {
  if (skip) {
    if (!mute) {
      console.info("[SCREENSHOT] skiped");
    }
  } else {
    const currentDate = Date.now();
    const outputPath = `./Downloads/${scriptName}-${currentDate}-${baseName}.png`;
    const screenshotOptions = {
      path: outputPath,
      fullPage,
    };
    await page.waitForTimeout(wait);
    await page.screenshot(screenshotOptions);
    if (!mute) {
      console.info("[SCREENSHOT] file:", outputPath);
    }
  }
}

module.exports = { takeScreenshot };
