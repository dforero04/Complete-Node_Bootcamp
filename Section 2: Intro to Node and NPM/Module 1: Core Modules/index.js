const fs = require('fs')
const http = require('http')
const url = require('url')

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

// This top level code is only executed at the start of the program, so it can be done synchronously
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data)

const server = http.createServer((req, res) => {
  const pathname = req.url;

  if(pathname === '/' || pathname === '/overview'){
    res.end('This is the OVERVIEW!')
  }else if(pathname === '/product'){
    res.end('This is the PRODUCT')
  }else if(pathname === '/api'){
    res.writeHead(200, {'Content-type': 'application/json'})
    res.end(data)
  }else{
    // Header information should always be set before the res.end
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    })
    res.end('<h1>This page cannot be found.</h1>')
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000...');
});