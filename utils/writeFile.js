const fs = require("fs").promises;

async function writeFile(outputPath, data) {
  try {
    await fs.writeFile(outputPath, data);
  } catch (error) {
    throw new Error(
      `writeFile.js - sth. went wrong with writing file: ${outputPath} on the disk. \n ${error}`
    );
  }
}

module.exports = { writeFile };
