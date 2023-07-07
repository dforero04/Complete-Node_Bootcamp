/////////////////////////////////////////////////////////
// STREAMS
/////////////////////////////////////////////////////////
// Used to process (read and write) data piece by piece, without completing the whole read and write operation,
// and therefore without keeping all the data in memory
////////////////////////////////////////////////////////
// Perfect for handling large volumes of data (e.g. videos)
// More efficient data processing in terms of memory and time
// Streams are instances of the EventEmitter class, so we can emit and listen to named events
////////////////////////////////////////////////////////
// Types of Streams
//
// Readable Streams - streams from which we can read data
// e.g. - https requests, fs read streams
// important events - data, end
// important functions - pipe(), read()
// ------------------------------------------------------
// Writable Streams - streams to which we can write data to
// e.g. - http responses, fs write streams
// important events - drain, finish
// important functions - write(), end()
// ------------------------------------------------------
// Duplex Streams - streams that are both readable and writable
// e.g. - net web sockets (comm channel between client and server)
// ------------------------------------------------------
// Transform Streams - Duplex streams that transform data as it is written or read
// e.g. - zlib Gzip creation
////////////////////////////////////////////////////////
const fs = require('fs')
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1 - not efficient
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data)
  // })

  // Solution 2 - Streams
  // This solution is also not efficient because the Readable stream (readable)
  // reads the information too fast for the Writable stream (res)
  // This is called back pressure, when the receiving stream cannot write fast enough for the data its given

  // // This Readable Stream can emit and listen to events
  // const readable = fs.createReadStream('test-file.txt');
  //
  // // The 'data' event is emitted when a piece of data is ready to be consumed
  // readable.on('data', chunk => {
  //   // Write to a Writable Stream, which response is writable
  //   res.write(chunk);
  // })
  // // Used once all the data is consumed
  // readable.on('end', () => {
  //   res.end();
  // })
  //
  // readable.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found!')
  // })

  // Solution 3 - pipe()
  // Readable stream manages the flow of data to the Writable stream
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests...');
})