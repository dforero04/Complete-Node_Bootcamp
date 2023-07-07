const fs = require('fs')
const crypto = require('crypto')

const start = Date.now();

// Since this is not called within in a callback function (not async), it is executed outside the event loop
setTimeout(() => {
  console.log('Timer 1 finished')
}, 0);

// Since this is not called within in a callback function (not async), it is executed outside the event loop
setImmediate(() => {
  console.log('Immediate 1 finished')
});

// Since this is not called within in a callback function (not async), it is executed outside the event loop
fs.readFile('test-file.txt', () => {
  console.log('I/O finished')
  console.log('-------------------------')

  // Since this timeout is called within a callback function (async), it enters the event loop and is processed accordingly (2)
  // It is second because it is not expired, so the event loop moves to the next stage
  setTimeout(() => {
    console.log('Timer 2 finished')
  }, 0);

  // Since this timeout is called within a callback function, it enters the event loop and is processed accordingly (3)
  // It is last because of the timeout length (not expired after 3 seconds)
  setTimeout(() => {
    console.log('Timer 3 finished')
  }, 3000);

  // Since this immediate is called within a callback function, it enters the event loop and is processed accordingly (1)
  // It is first because it is followed by non-expired timeouts, except when the process.nextTick is called
  setImmediate(() => {
    console.log('Immediate 2 finished')
  });

  // Since this is a microtask, it is executed in between the 4 stages of the event loop.
  // It is first because it happens in between the first 2 stages of the event loop.
  process.nextTick(() => {
    console.log('Process.nextTick')
  })

  // This is passed off to the thread pool since it requires complex calculations
  // You can also run the SYNC version of this to see how it blocks execution of the program
  // crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
  // console.log(Date.now() - start, 'Password encrypted')
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted')
  })

});

// This is executed 1st since it is top level code
console.log('Hello from the top-level code');