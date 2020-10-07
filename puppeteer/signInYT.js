const { takeScreenshot } = require("../puppeteer/takeScreenshot");

require("dotenv").config();
const email = process.env.LOGIN_ID;
const passwd = process.env.LOGIN_PASSWORD;

async function signInYT({ page, scriptName }) {
  // * get rid of pop-up banner the middle of the page
  const signInButton = 'paper-dialog paper-button[aria-label="Sign in"]';
  await page.waitForSelector(signInButton);
  await page.click(signInButton);
  console.info("[CLICKED] Sign in button");

  // * sign in to the account
  await page.mainFrame().waitForSelector("#identifierId");
  await takeScreenshot({
    skip: true,
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
}

module.exports = { signInYT };
