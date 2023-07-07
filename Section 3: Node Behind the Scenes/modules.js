/////////////////////////////////////////////////
// Each JS file is treated as a separate module
// Node.js uses the CommonJS (CJS) module system: require(), exports or module.exports
// ES (ESM) module system is used in browsers: import/export
/////////////////////////////////////////////////
// Steps to require()
// Resolving & Loading
// - Path Resolving: How Node decides which module to load
// - - Start with core modules
// - - If begins with './' or '../', it tries to load developer modules
// - - If no file found, tries to find folder with index.js in it
// - - Else, goes to node_modules/ and tries to find module in there
// -------------------------------------------------------------------
// Wrapping
// - Module is 'wrapped' in a special function (wrapper function)
// - - In the wrapper function, we are given exports, require, module, __filename, and __dirname
// - - - exports = a reference to module.exports, used to export object from a module
// - - - require = function to require modules
// - - - module = reference to the current module
// - - - __filename = absolute path of the current module's file
// - - - __dirname = directory name of the current module
// - - Top level variables in wrapper functions are private scoped
// -------------------------------------------------------------------
// Execution
// - Module's code get executed by NodeJS runtime
// -------------------------------------------------------------------
// Returning Exports
// - require function returns exports of the required module
// - module.exports is the returned object
// -------------------------------------------------------------------
// Caching
// - Modules are cached after the first time they are loaded
/////////////////////////////////////////////////////////////////

// // This displays the arguments that are provided by module wrapper function
// console.log(arguments);
// // This displays the wrapper function
// console.log(require('module').wrapper)

// module.exports
// Used to add only one thing to exports
const Calc = require('./test-module-1');
const calc1 = new Calc();
console.log(calc1.add(2, 5));

// exports
// Used to add multiple things to exports
const {add, multiply} = require('./test-module-2');
console.log(add(2, 6));
console.log(multiply(2, 6));

// caching
// This example is to show that modules are cached after loading.
// So the 'Hello from module 3' is only displayed once because it is top level code within the module and only loaded once
// However, the function that is being exported from the module is called directly, so those logs will display multiple times
// from the cache
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();

