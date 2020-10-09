//Puppeteer util
async function countTagChildrens(page, selector) {
  return await page.$eval(selector, (el) => {
    const childrens = el.children;
    return childrens.length;
  });
}

module.exports = { countTagChildrens };
