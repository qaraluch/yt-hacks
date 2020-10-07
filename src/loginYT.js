const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const path = require("path");
const { takeScreenshot } = require("../puppeteer/takeScreenshot");
const { waitTillLoaded } = require("../puppeteer/waitTillLoaded");
const { signInYT } = require("../puppeteer/signInYT");

// Need to pass G tests on headless browser connections.
puppeteer.use(StealthPlugin());

const scriptName = path.parse(__filename).name;

const webUrl = "https://www.youtube.com";

async function run() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Events:
    page.once("load", () => console.info("[OK] The page is loaded"));

    // * load page
    console.log("[TASK] About to sign in to the website:");
    console.log("  ... ", webUrl);
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(webUrl, { waitUntil: ["networkidle2"] });
    await takeScreenshot({
      skip: true,
      page,
      scriptName,
      baseName: "entry",
    });

    await signInYT({ page });

    await waitTillLoaded({ page, scriptName });

    await takeScreenshot({
      page,
      scriptName,
      baseName: "final",
    });

    browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
