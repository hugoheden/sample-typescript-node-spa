import * as url from 'node:url';
import path from 'node:path';
import {readdirSync, readFileSync} from 'node:fs';
import precinct from "precinct";
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .option('production-src-dirs', {
        alias: 'p',
        describe: 'Specify production source directories',
        type: 'array',
    })
    .version(false)
    .help()
    // TODO - a little help text?
    .usage(
        "Checks the production source code imports against the package.json " +
        "dependencies section. Uses the precinct library to analyze the " +
        "source code -- see https://github.com/dependents/node-precinct/. " +
        "The idea is to make it easier to spot mistakes where dependencies " +
        "have mistakenly been added to the \"devDependencies\" instead of " +
        "\"dependencies. \"" +
        "Note that this is not fool-proof. For example, it doesn't always " +
        "detect dynamic imports. But nevertheless, this can be somewhat " +
        "helpful."
    )
    .argv;

const productionSrcDirs = argv["productionSrcDirs"] || ['src']
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// const prodSrcRoot = path.resolve(__dirname, 'src', 'backend');
const srcFileMatcher = /\.(js|jsx|ts|tsx|mjs|cjs|mts|cts)$/;


/** Assuming `importPath` is the import string and `sourceFile` is the file containing the import */
function isLocalImport(importPath, sourceFile) {
    const sourceDir = path.dirname(sourceFile);
    const resolvedPath = path.resolve(sourceDir, importPath);
    // Check for file existence with possible extensions
    const possibleExtensions = ['.js', '.ts', '.json', '.jsx', '.tsx'];
    for (let ext of possibleExtensions) {
        if (fs.existsSync(resolvedPath + ext)) {
            return true;
        }
    }
    return false;
}

/**
 * Reads the "dependencies" section in the package.json file and returns a set of the names (i.e. not the versions).
 * @return {Set<string>}
 */
function extractPackageJsonProductionDeps() {
    const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
    return new Set(Object.keys(packageJson.dependencies || {}));
}

/**
 * Uses the precinct library to analyze the production source code and extract all dependencies.
 * @return {Set<String>}
 */
function analyzeProductionSourceDependencies() {
    const productionSourceFiles = productionSrcDirs
        .map(dir => path.resolve(process.cwd(), dir))
        .flatMap(dir => readdirSync(dir, {recursive: true, withFileTypes: true}))
        .filter(dirent => dirent.isFile() && dirent.name.match(srcFileMatcher))
        .map(dirent => path.resolve(dirent.path, dirent.name))
        .flatMap(pathStr => precinct.paperwork(pathStr, {includeCore: false}));
    return new Set(productionSourceFiles);
}

/**
 * Calculate the difference between an iterable and a set. The returned array will contain all elements from the iterable
 * that are not in the set.
 * @return {Array}
 */
function calculateDifference(iterable = packageJsonProductionDeps, set = productionSourceDependencies) {
    return Array.from(iterable).filter(d => !set.has(d));
}


const packageJsonProductionDeps = extractPackageJsonProductionDeps();
const productionSourceDependencies = analyzeProductionSourceDependencies();
const superfluousPackageJsonDeps = calculateDifference(packageJsonProductionDeps, productionSourceDependencies);
const missingPackageJsonDeps = calculateDifference(productionSourceDependencies, packageJsonProductionDeps);

if (superfluousPackageJsonDeps.length > 0) {
    console.warn('Superfluous in package.json, "dependencies" section: ', superfluousPackageJsonDeps);
}
if (missingPackageJsonDeps.length > 0) {
    console.error('Missing in package.json, "dependencies" section: ', missingPackageJsonDeps);
    process.exit(1);
}
