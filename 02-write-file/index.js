const fs = require('fs');
const path = require('path');
const readline = require('readline');

const myConsole = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeStream = fs.createWriteStream(path.join(__dirname, 'yourHistory.txt'));

myConsole.write('Welcome. How`re you?\n');

myConsole.on('line', (text) => {
  if (text.trim().toLowerCase() === 'exit') myConsole.close();
  else writeStream.write(`${text}\n`);
});

myConsole.on('close', () => {
  console.log('Finished input');
  process.exit();
});

myConsole.on('SIGINT', () => {
  console.log('Finished input');
  process.exit();
});