//Puppeteer util
//You can not console.log inside page evaluation API.
//For this task you need use this puppeteer's event stream handler
function consoleLogBrowser(page) {
  page.on("console", (consoleMessageObject) => {
    if (consoleMessageObject._type !== "error") {
      console.log(consoleMessageObject._text);
    }
  });
}

module.exports = { consoleLogBrowser };
