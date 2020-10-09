//Puppeteer util
async function waitTillLoaded({ page }) {
  await page.waitForNavigation({
    waitUntil: ["networkidle2"],
  });
}

module.exports = { waitTillLoaded };
