// program.js
import './modules/esm-module.mjs';
const commonJsModule = require('./modules/commonJs-module.js');
import "express";
const lodash = require("lodash")

// Dynamic import for ESM module
import('./modules/esm-module.mjs').then(esmModule => {
    console.log(esmModule.greet()); // From ESM module
});

console.log(commonJsModule.sayGoodbye()); // From CommonJS module