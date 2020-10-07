const puppeteer = require("puppeteer");
const path = require("path");
const { takeScreenshot } = require("../puppeteer/takeScreenshot");

require("dotenv").config();
const webUrl = process.env.SCREENSHOT_WEB_URL;
const outputBaseName = process.env.SCREENSHOT_OUTPUTFILE;

const scriptName = path.parse(__filename).name;

async function run() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Events:
    page.once("load", () => console.info("[OK] The page is loaded"));

    console.log("About to take screenshot of:");
    console.log("  ... website: ", webUrl);
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(webUrl, { waitUntil: ["networkidle2"] });
    await takeScreenshot({
      page,
      scriptName,
      baseName: outputBaseName,
    });

    browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
