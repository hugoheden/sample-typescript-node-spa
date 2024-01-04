A quick test for check-prod-deps.js.

$ npm install
$ ../WiP-check-prod-deps.js theDist/

Should output:

Superfluous in package.json, "dependencies" section:  [ 'kind-of' ]
Missing in package.json, "dependencies" section:  [
  './modules/does-not-exist.mjs',
  'does-not-exist-1',
  './modules/does-not-exist.js',
  'does-not-exist-2'
]
