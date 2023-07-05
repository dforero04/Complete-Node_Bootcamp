const fs = require('fs')

// Used to read files from the file system
const textInput = fs.readFileSync('./input.txt', 'utf-8');
console.log(textInput)

// Used to write files to the file system
const textOutput = `This is what we know about the avocado: ${textInput}`;
fs.writeFileSync('./output.txt', textOutput);

console.log('File written')

