const fs = require('fs')
const http = require('http')

/*
Read and Write to File System
 */

// Used to read and write files from and to the file system SYNCHRONOUSLY (BLOCKING)
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput)
//
// const textOutput = `This is what we know about the avocado: ${textInput}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File written')

// Used to read and write files from and to the file system ASYNCHRONOUSLY (NON-BLOCKING)
// This uses callback hell, and the better method will be discussed later
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if(err) return console.error('Error!')
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written!')
//       })
//     })
//   })
// });
// console.log('Reading file...')

/******************
SERVER
 *******************/

const server = http.createServer((req, res) => {
  res.end('Hello from the server!');
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000...')
})