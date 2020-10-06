const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const path = require("path");

puppeteer.use(StealthPlugin());

require("dotenv").config();

const scriptName = path.parse(__filename).name;

const webUrl = process.env.SCREENSHOT_WEB_URL;
const email = process.env.SCREENSHOT_LOGIN;
const passwd = process.env.SCREENSHOT_PASSWORD;

// helpers
// usage: await takeScreenshot({ page, scriptName, baseName: "end-screenshot", wait: 500 });
async function takeScreenshot({ page, scriptName, baseName, wait = 0 }) {
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

async function waitTillLoaded({ page }) {
  await page.waitForNavigation({
    waitUntil: ["networkidle2"],
  });
}

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
      page,
      scriptName,
      baseName: "entry",
    });

    // * get rid of pop-up banner the middle of the page
    const signInButton = 'paper-dialog paper-button[aria-label="Sign in"]';
    await page.waitForSelector(signInButton);
    await page.click(signInButton);
    console.info("[CLICKED] Sign in button");

    // * sign in to the account
    await page.mainFrame().waitForSelector("#identifierId");
    await takeScreenshot({
      page,
      scriptName,
      baseName: "log-in",
    });
    await page.type("#identifierId", email, { delay: 5 });
    const nextButton = "#identifierNext";
    await page.click(nextButton);
    console.info("[INPUT] Entered id and click next button");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', passwd, { delay: 5 });
    console.log("[INPUT] Entered password:", "*".repeat(passwd.length));
    const passwordNextButton = "#passwordNext";
    await page.waitForSelector(passwordNextButton, { visible: true });
    await page.click(passwordNextButton);
    console.info("[CLICKED] next button");

    await waitTillLoaded({ page });

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
