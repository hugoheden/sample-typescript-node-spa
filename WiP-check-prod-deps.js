const path = require("node:path");
const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");
const {readFileSync, readdirSync} = require("node:fs");
const {paperwork} = require("precinct");

const argv = yargs(hideBin(process.argv))
    .option('dist-dir', {
        alias: 'p',
        describe: 'Specify a directory for the app distribution code. Defaults to "dist".',
        type: 'string',
    })
    .version(false)
    .help()
    .usage(
        "Checks the dist code imports against the package.json " +
        "dependencies section. Uses the precinct library to analyze the " +
        "code -- see https://github.com/dependents/node-precinct/. " +
        "The idea is to make it easier to spot mistakes where dependencies " +
        "have mistakenly been added to the \"devDependencies\" instead of " +
        "\"dependencies. \"" +
        "Note that this is not foolproof. For example, it doesn't always " +
        "detect dynamic imports. But nevertheless, this can be somewhat " +
        "helpful."
    )
    .argv;

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

/** Assuming `importPath` is the import string and `importingFile` is the file containing the import */
function isLocalImport(distDir, importingFile, importPath) {
    try {
        const resolvedPath = require.resolve(importPath, {paths: [path.dirname(importingFile)]});
        // Check if the resolved path includes 'node_modules'
        return isAncestorDirectory(distDir, resolvedPath);
    } catch (e) {
        // The module couldn't be resolved; it might be external or just non-existent
        return false;
    }
}


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
 * Uses the precinct library to extract all imports (in any module system) found in JavaScript code.
 * @return {Set<String>}
 */
function extractExternalImports(distDir) {
    const dependencies = findJSFiles(distDir)
        .flatMap(jsFile =>
            paperwork(jsFile, {includeCore: false, es6: {mixedImports: true}})
                .filter(importPath => !isLocalImport(distDir, jsFile, importPath)));
    return new Set(dependencies);
}

/**
 * Calculate the difference between an iterable and a set. The returned array will contain all elements from the iterable
 * that are not in the set.
 * @return {Array}
 */
function calculateDifference(iterable, set) {
    return Array.from(iterable).filter(d => !set.has(d));
}

const distDir = path.resolve(process.cwd(), argv["distDir"] || 'dist');
const jsFileMatcher = /\.(js|jsx|mjs|cjs)$/;

const packageJsonProdDependencies = extractPackageJsonProductionDependencies('package.json');
const externalImports = extractExternalImports(distDir);
const superfluousPackageJsonDeps = calculateDifference(packageJsonProdDependencies, externalImports);
const missingPackageJsonDeps = calculateDifference(externalImports, packageJsonProdDependencies);

if (superfluousPackageJsonDeps.length > 0) {
    console.warn('Superfluous in package.json, "dependencies" section: ', superfluousPackageJsonDeps);
}
if (missingPackageJsonDeps.length > 0) {
    console.error('Missing in package.json, "dependencies" section: ', missingPackageJsonDeps);
    process.exit(1);
}
console.info("All good.");
