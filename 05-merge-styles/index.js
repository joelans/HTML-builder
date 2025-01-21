const fs = require('fs/promises');
const fsn = require('fs');
const path = require('path');

const pathOfFolder = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');
const writeableStream = fsn.createWriteStream(dest, {flag:'a'});

combineStyles();

async function combineStyles() {
  try {
    const files = await fs.readdir(pathOfFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() === true && path.extname(file.name) === '.css') {
        const pathOfFile = path.join(pathOfFolder, file.name);

        const content = await fs.readFile(pathOfFile);

        writeableStream.write(content);
        writeableStream.write('\n');
      }
    }
  } catch (error) {
    console.error(error);
  }
  writeableStream.close();
}