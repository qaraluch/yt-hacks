//Puppeteer util
async function getTagChildrenPositionByOuterText(page, selector, matchText) {
  return await page.$$eval(
    selector,
    (node, matchText) => {
      const nodeList = [...node];
      const match = nodeList.reduce((acc, curr, idx) => {
        if (curr.outerText.trim() === matchText) {
          return [...acc, idx + 1]; // html childrens is not 0-indexed
        } else {
          return [...acc];
        }
      }, []);
      if (typeof match[0] !== "number") {
        return null;
      } else {
        return match[0];
      }
    },
    matchText
  );
}

module.exports = { getTagChildrenPositionByOuterText };
