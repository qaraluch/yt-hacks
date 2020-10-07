async function takeScreenshot({
  skip = false,
  page,
  scriptName,
  baseName,
  wait = 0,
}) {
  if (skip) {
    console.info("[SCREENSHOT] skiped");
  } else {
    const currentDate = Date.now();
    const outputPath = `./Downloads/${scriptName}-${currentDate}-${baseName}.png`;
    const screenshotOptions = {
      path: outputPath,
      fullPage: true,
    };
    await page.waitForTimeout(wait);
    await page.screenshot(screenshotOptions);
    console.info("[SCREENSHOT] file:", outputPath);
  }
}

module.exports = { takeScreenshot };
