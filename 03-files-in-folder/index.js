const fs = require('fs/promises');
const path = require('path');

const pathOfFolder = path.join(__dirname, 'secret-folder');

getInformation();

async function getInformation() {
  try {
    const files = await fs.readdir(pathOfFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() === true) {
        const extension = path.extname(file.name).substring(1);
        let name = path.basename(file.name, extension);
        name = name.substring(0, name.length - 1);

        const pathOfFile = path.join(pathOfFolder, file.name);
        const informationOfFile = await fs.stat(pathOfFile);
        const size = `${(informationOfFile.size / 1024).toFixed(3)} kb`;

        console.log(`${name} - ${extension} - ${size}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
