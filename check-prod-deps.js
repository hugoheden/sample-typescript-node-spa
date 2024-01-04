#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");
const {readFileSync, readdirSync} = require("node:fs");
const {paperwork} = require("precinct");

/**
 * Reads the "dependencies" section in the package.json file and returns a set of the names (i.e. not the versions).
 * @return {Set<string>}
 */
function extractPackageJsonProductionDependencies(packageJsonFile) {
    const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, packageJsonFile), 'utf8'));
    return new Set(Object.keys(packageJson.dependencies || {}));
}

/**
 * Returns absolute paths to all JavaScript files in the given directory.
 * @return {string[]}
 */
function findJSFiles(distDir) {
    return [path.resolve(process.cwd(), distDir)]
        .flatMap(dir => readdirSync(dir, {recursive: true, withFileTypes: true}))
        .filter(dirent => dirent.isFile() && dirent.name.match(jsFileMatcher))
        .map(dirent => path.resolve(dirent.path, dirent.name));
}

/**
 * Returns true if `parentDirectory` is an ancestor directory of `somePath`, false otherwise.
 */
function isAncestorDirectory(ancestorDirectory, somePath) {
    ancestorDirectory = path.normalize(ancestorDirectory);
    somePath = path.normalize(somePath);
    if (!ancestorDirectory.endsWith(path.sep)) {
        ancestorDirectory += path.sep;
    }
    if (somePath.length <= ancestorDirectory.length) {
        return false;
    }
    return somePath.startsWith(ancestorDirectory);
}

/**
 * Returns true if the given `importPath` is local, i.e. if when resolved it will be found under the given `distDir`.
 * @return {boolean}
 */
function isLocalImport(distDir, importingFile, importPath) {
    try {
        const resolvedPath = require.resolve(importPath, {paths: [path.dirname(importingFile)]});
        return isAncestorDirectory(distDir, resolvedPath);
    } catch (e) {
        // The module couldn't be resolved; it might be external or just non-existent
        return false;
    }
}


/**
 * Uses the precinct library to extract all imports (in any module system) found in JavaScript code.
 * @return {Set<String>}
 */
function extractExternalImports(distDir) {
    const dependencies = findJSFiles(distDir)
        .flatMap(jsFile => paperwork(jsFile, {includeCore: false, es6: {mixedImports: true}})
            .filter(importPath => !isLocalImport(distDir, jsFile, importPath)));
    return new Set(dependencies);
}

/**
 * Calculate the difference between an iterable and a set. The returned array will contain all elements from the iterable
 * that are not present in the set.
 * @return {Array}
 */
function calculateDifference(iterable, set) {
    return Array.from(iterable).filter(d => !set.has(d));
}

const argv = yargs(hideBin(process.argv))
    .version(false)
    .usage('$0 [dir]',
        'Given a directory structure containing JavaScript code, this script ' +
        'finds any module imports used, and verifies that each imported module is either: \n ' +
        ' * resolvable under the same directory structure \n' +
        ' * specified in package.json:s dependencies section AND resolvable in node_modules. \n' +
        ' \n' +
        'This helps spot mistakes where dependencies have mistakenly been added to the "devDependencies" instead ' +
        'of "dependencies". ' +
        'Uses the precinct library to find the module import directives -- see https://github.com/dependents/node-precinct/. ' +
        'Note that this is not foolproof in the case of _dynamic_ imports, ' +
        'which might be found only if expressed as a string literal',
        (yargs) => {
            yargs.positional('dir', {
                describe: 'Directory to analyze', type: 'string', default: './dist'
            })
        })
    .option('package-json', {
        alias: 'p', describe: 'Path to package.json', type: 'string', default: './package.json'
    })
    .help()
    .argv;

const scriptLogName = argv["$0"];
const distDir = path.resolve(process.cwd(), argv["dir"]);
const packageJson = path.resolve(process.cwd(), argv["packageJson"]);
if (!fs.existsSync(distDir)) {
    console.error(`${scriptLogName}: directory not found: ${distDir}`);
    process.exit(1);
}
if (!fs.existsSync(packageJson)) {
    console.error(`${scriptLogName}: package.json not found: ${packageJson}`);
    process.exit(1);
}
const jsFileMatcher = /\.(js|jsx|mjs|cjs)$/;

const packageJsonProdDependencies = extractPackageJsonProductionDependencies(packageJson);
const externalImports = extractExternalImports(distDir);
const superfluousPackageJsonDeps = calculateDifference(packageJsonProdDependencies, externalImports);
const missingPackageJsonDeps = calculateDifference(externalImports, packageJsonProdDependencies);

if (superfluousPackageJsonDeps.length > 0) {
    console.warn(`${scriptLogName}: Superfluous in package.json, "dependencies" section: ${superfluousPackageJsonDeps}`);
}
if (missingPackageJsonDeps.length > 0) {
    console.error(`${scriptLogName}: Missing in package.json, "dependencies" section: ${missingPackageJsonDeps}`);
    process.exit(1);
}
if (superfluousPackageJsonDeps.length === 0) {
    console.info(`${scriptLogName}: All good.`);
}
