//Puppeteer util
async function getTagOuterText(page, selector) {
  return await page.$eval(selector, (el) => {
    return el.outerText;
  });
}

module.exports = { getTagOuterText };
