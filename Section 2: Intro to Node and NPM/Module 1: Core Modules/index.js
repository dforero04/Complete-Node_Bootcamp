const fs = require('fs')

// Used to read and write files from and to the file system SYNCHRONOUSLY
// const textInput = fs.readFileSync('./input.txt', 'utf-8');
// console.log(textInput)
//
// const textOutput = `This is what we know about the avocado: ${textInput}`;
// fs.writeFileSync('./output.txt', textOutput);
// console.log('File written')

// Used to read and write files from and to the file system ASYNCHRONOUSLY
fs.readFile('./input.txt', 'utf-8', (err, data) => {
  console.log(data);
});
console.log('Reading file...')

