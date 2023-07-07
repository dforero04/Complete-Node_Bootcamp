const EventEmitter = require('events')
const http = require('http')

// Useful to make a class that extends EventEmitter when you will listen to events in multiple areas
// Many other core Node modules inherit from the EventEmitter class in their implementation
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

// "Event Listener"
myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
})

// "Event Listener"
myEmitter.on('newSale', () => {
  console.log('Customer name: Daniel');
})

// "Event Listener"
myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock`);
})

// Calling (emitting) the event
// Mainly used for custom events
// You can pass in arguments to be used by the "Event Listeners"
myEmitter.emit('newSale', 9);

//////////////////////////////////////////////////////////////////////////////////
// SERVER LISTENING TO REQUESTS EXAMPLE

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received');
  res.end('Request received!')
})

server.on('request', (req, res) => {
  console.log('Another request');
})

server.on('close', () => {
  console.log('Server closed!');
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...')
})