const fs = require('fs/promises');
const fsn = require('fs');
const path = require('path');

const pathOfNewFolder = path.join(__dirname, 'project-dist');
let writeableStream;
buildPage();

async function buildPage() {
  await fs.rm(pathOfNewFolder, {recursive: true, force: true});
  await fs.mkdir(pathOfNewFolder, { recursive: true });

  createHtml();
  mergeStyles();

  const pathOfSourceFolder = path.join(__dirname, 'assets');
  const pathOfDestinationFolder = path.join(__dirname, 'project-dist', 'assets');
  copyDirectory(pathOfSourceFolder, pathOfDestinationFolder);
}

async function createHtml() {
  const pathOfTemplate = path.join(__dirname, 'template.html');
  let template = await fs.readFile(pathOfTemplate);

  const pathOfComponentFiles = path.join(__dirname, 'components');
  const componentFiles = await fs.readdir(pathOfComponentFiles, {withFileTypes: true});
  for (let componentFile of componentFiles) {
    const pathOfComponentFile = path.join(pathOfComponentFiles, componentFile.name);
    const extensionOfComponentFile = path.extname(pathOfComponentFile);

    if (componentFile.isFile() && extensionOfComponentFile === '.html') {
      const componentFileName = path.basename(componentFile.name, extensionOfComponentFile);
      const templateOfComponentFile = await fs.readFile(pathOfComponentFile);

      template = template.toString().replace(`{{${componentFileName}}}`, templateOfComponentFile);
    }
  }
  writeableStream = fsn.createWriteStream(path.join(pathOfNewFolder, 'index.html'));
  writeableStream.write(template);
  writeableStream.close();
}

async function mergeStyles() {
  const pathOfFolder = path.join(__dirname, 'styles');
  const dest = path.join(__dirname, 'project-dist', 'style.css');
  writeableStream = fsn.createWriteStream(dest, {flag:'a'});

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
}

async function copyDirectory(pathOfFilesFolder, pathOfFilesCopyFolder) {
  const files = await fs.readdir(pathOfFilesFolder, { withFileTypes: true });
  for (const file of files) {
    const source = path.join(pathOfFilesFolder, file.name);
    const destination = path.join(pathOfFilesCopyFolder, file.name);
    if (file.isFile() === true) {
      await fs.copyFile(source, destination);
    } else {
      await fs.mkdir(destination, {recursive: true});
      await copyDirectory(source, destination);
    }
  }
}