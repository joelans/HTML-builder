const fs = require('fs');
const path = require('path');

const pathOfFile = path.join(__dirname, 'text.txt')
const readableStream = fs.createReadStream(pathOfFile);

readableStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

