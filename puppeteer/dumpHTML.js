//Puppeteer util
const { writeFile } = require("../utils/writeFile");

async function dumpHTML(page, selector = "*") {
  const pathDump = "./Downloads/page-dump-endOfVideoList.html";
  const data = await page.evaluate(
    (selector) => document.querySelector(selector).outerHTML,
    selector
  );
  await writeFile(pathDump, data);
  console.log("[ HTML DUMPED ] to the file: ", pathDump);
}

module.exports = { dumpHTML };
