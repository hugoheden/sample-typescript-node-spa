// Existing stuff
import './modules/esm-module.mjs';
import "is-number";
// Non-existing stuff
import './modules/does-not-exist.mjs';
import "does-not-exist-1";

// Existing stuff
require('./modules/commonJs-module.js');
require("is-buffer")
// Non-existing stuff
require('./modules/does-not-exist.js');
require("does-not-exist-2")

import('./modules/esm-module.mjs').then(esmModule => {
    console.log(esmModule.greet()); // From ESM module
});
