//Puppeteer util
async function hasTagAttribute(page, selector, attribute) {
  if ((await page.$(selector)) !== null) {
    return await page.$eval(
      selector,
      (el, attribute) => {
        return el.hasAttribute(attribute);
      },
      attribute
    );
  } else {
    // uncomment for debugging
    // console.log(
    //   "   [ hasTagAttribute.js ] Error: Not found selector: ",
    //   selector
    // );
    return false;
  }
}

module.exports = { hasTagAttribute };
