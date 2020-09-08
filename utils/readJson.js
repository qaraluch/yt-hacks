const fs = require("fs");
const { readFile } = fs.promises;

async function readJson(filePath) {
  try {
    const data = await readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(
      `readJson.js - sth. went wrong with reading file: ${filePath}. \n ${error}`
    );
  }
}

module.exports = { readJson };
