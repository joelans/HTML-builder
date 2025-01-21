const fs = require('fs/promises');
const path = require('path');

copyDirectory();

async function copyDirectory() {
  const pathOfFilesCopyFolder = path.join(__dirname, 'files-copy');
  await fs.rm(pathOfFilesCopyFolder, {recursive: true, force: true});
  await fs.mkdir(pathOfFilesCopyFolder, { recursive: true });
  const pathOfFilesFolder = path.join(__dirname, 'files');
  const files = await fs.readdir(pathOfFilesFolder, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() === true) {
      const source = path.join(pathOfFilesFolder, file.name);
      const dest = path.join(pathOfFilesCopyFolder, file.name);
      await fs.copyFile(source, dest);
    }
  }
}