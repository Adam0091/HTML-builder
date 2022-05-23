const fs = require('fs');
const path = require('path');

const response = fs.createReadStream(path.join(__dirname, 'text.txt'));
let result = '';

response.on('data', (a) => result += String(a));
response.on('end', () => console.log(result));
response.on('error', (err) => console.log(new Error(err.message)));