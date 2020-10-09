//Puppeteer util
async function scrollDownPage(page, selector) {
  await page.$eval(selector, (el) => {
    el.scrollIntoView({ behavior: "auto", block: "end", inline: "end" });
  });
}

module.exports = { scrollDownPage };
