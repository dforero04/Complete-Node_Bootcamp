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

///////////////////////
// SERVER

// This top level code is only executed at the start of the program, so it can be done synchronously
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data)

// This function replaces all the placeholders in our template-card with the actual values from the data
// Returns the final string value for each product object
const replaceTemplate = (tempCard, product) => {
  let output = tempCard.replace(/{%PRODUCT_ID%}/g, product.id);
  output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_FROM%}/gi, product.from);
  output = output.replace(/{%PRODUCT_NUTRIENT%}/g, product.nutrients);
  output = output.replace(/{%PRODUCT_QTY%}/g, product.quantity);
  output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
  if(!product.organic) output = output.replace(/{%PRODUCT_NOT_ORGANIC%}/g, 'not-organic');
  output = output.replace(/{%PRODUCT_DESC%}/g, product.description);

  return output;
}

const server = http.createServer((req, res) => {
  const pathname = req.url;

  // OVERVIEW PAGE
  if(pathname === '/' || pathname === '/overview'){
    res.writeHead(200, {
      'Content-type': 'text/html'
    })
    // This takes all the objects from the data.json file and joins all the HTML into one string
    const cardsHtml = dataObject.map(item =>
      replaceTemplate(templateCard, item)
    ).join('');

    res.end(templateOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml));

  // PRODUCT PAGE
  }else if(pathname === '/product'){
    res.writeHead(200, {
      'Content-type': 'text/html'
    })
    res.end(templateProduct)

  // API
  }else if(pathname === '/api'){
    res.writeHead(200, {'Content-type': 'application/json'})
    res.end(data)

  // NOT FOUND PAGE
  }else{
  // Header information should always be set before the res.end
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world' // You can also create you own header information
    })
    res.end('<h1>This page cannot be found.</h1>')
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000...');
});