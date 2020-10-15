const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const path = require("path");
const { takeScreenshot } = require("../puppeteer/takeScreenshot");
const { waitTillLoaded } = require("../puppeteer/waitTillLoaded");
const { signInYT } = require("../puppeteer/signInYT");
const { lazyLoadPageContent } = require("../puppeteer/lazyLoadPageContent");
const { consoleLogBrowser } = require("../puppeteer/consoleLogBrowser");
const {
  copyVideosBetweenPlaylists,
} = require("../puppeteer/copyVideosBetweenPlaylists");

// Need to pass G tests on headless browser connections.
puppeteer.use(StealthPlugin());

const scriptName = path.parse(__filename).name;

const webUrl = "https://www.youtube.com";
const webUrlWL = `${webUrl}/playlist?list=WL`;

async function run() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Events:
    page.once("load", () => console.info("[OK] The page is loaded"));

    // uncomment when you need to bubble out console.logs from inside of puppeteer browser
    // consoleLogBrowser(page);

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

    // * log in by using user's credentials
    await signInYT({ page, scriptName });
    await waitTillLoaded({ page });

    // * go to Watch Later playlist
    console.log("[TASK] Lazy load all 'Watch Later' playlist's videos:");
    await page.goto(webUrlWL, { waitUntil: ["networkidle2"] });

    // * load all playlist's videos
    await lazyLoadPageContent({ page, scriptName });

    // * copy videos
    console.info("[TASK] About to copy videos to:");
    await copyVideosBetweenPlaylists(page, "wl-back");

    await takeScreenshot({
      skip: true,
      mute: true,
      page,
      scriptName,
      baseName: "dev",
      fullPage: false,
    });

    browser.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
