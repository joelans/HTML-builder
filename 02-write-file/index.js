const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const pathOfFile = path.join(__dirname, 'text.txt')
const writeableStream = fs.createWriteStream(pathOfFile);

console.log('You could write your message here');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (data) => {
  if (data === 'exit') {
    rl.close();
  } else {
    writeableStream.write(data);
    writeableStream.write('\n');
  }
});

process.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  console.log('See you later!');
  writeableStream.close();
});