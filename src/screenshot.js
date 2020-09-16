const puppeteer = require("puppeteer");

require("dotenv").config();

const webUrl = process.env.SCREENSHOT_WEB_URL;
const outputBaseName = process.env.SCREENSHOT_OUTPUTFILE;
const currentDate = Date.now();
const outputPath = `./Downloads/${outputBaseName}-${currentDate}.png`;

const screenshotOptions = {
  path: outputPath,
  fullPage: true,
};

async function run() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Events:
    // Emitted when the page is fully loaded
    page.once("load", () => console.info("✅ Page is loaded"));

    console.log("About to take screenshot of:");
    console.log("  ... website: ", webUrl);
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(webUrl);
    await page.waitForTimeout(1500);
    await page.screenshot(screenshotOptions);
    console.log("To the output:");
    console.log("  ... file: ", outputPath);
    browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
