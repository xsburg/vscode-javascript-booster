import { ensureFileSync, readFileSync, writeFileSync } from 'fs-extra';
import * as glob from 'glob';
import { hook, Instrumenter, Reporter } from 'istanbul';
import { join, relative } from 'path';
import * as remapIstanbul from 'remap-istanbul';
import { ExtensionContext, Memento } from 'vscode';

type MatcherFunction = ((file: string) => boolean) & { files?: string[] };
type Transformer = (code: string, filename: string) => string;

function reportCoverage(
    coverageVariable: string,
    matchFunction: MatcherFunction,
    instrumenter: any,
    transformer: Transformer
): void {
    hook.unhookRequire();

    const coverage = (global as any)[coverageVariable];

    if (typeof coverage === 'undefined' || Object.keys(coverage).length === 0) {
        // tslint:disable-next-line:no-console
        console.error(
            'No coverage information was collected, exit without writing coverage information'
        );
        return;
    }

    for (const file of matchFunction.files || []) {
        if (coverage[file]) {
            continue;
        }
        transformer(readFileSync(file, 'utf-8'), file);

        for (const key of Object.keys((instrumenter as any).coverState.s)) {
            (instrumenter as any).coverState.s[key] = 0;
        }

        coverage[file] = (instrumenter as any).coverState;
    }

    const coverageDir = join(__dirname, '..', '..', 'coverage');
    const coverageFile = join(coverageDir, 'coverage.json');

    ensureFileSync(coverageFile);
    writeFileSync(coverageFile, JSON.stringify(coverage), 'utf8');

    const remappedCollector = remapIstanbul.remap(coverage, {
        warn: () => {},
    });

    const reporter = new Reporter(undefined, coverageDir);
    reporter.add('lcov');
    reporter.write(remappedCollector, true, () => {
        // tslint:disable-next-line:no-console
        console.log(`Reports written to ${coverageDir}`);
    });
}

export function setupTestCoverage(sourceRoot: string) {
    const coverageVariable = `$$cov_${new Date().getTime()}$$`;
    const sourceFiles = glob.sync('**/**.js', { cwd: sourceRoot });
    const fileMap: any = {};
    const instrumenter = new Instrumenter({ coverageVariable });

    for (const file of sourceFiles) {
        const fullPath = join(sourceRoot, file);
        fileMap[fullPath] = true;
        const decache = require('decache');
        decache(fullPath);
    }

    const matchFunction: MatcherFunction = (file) => fileMap[file];
    matchFunction.files = Object.keys(fileMap);

    const hookOpts = { verbose: false, extensions: ['.js'] };
    const transformer = instrumenter.instrumentSync.bind(instrumenter);
    hook.hookRequire(matchFunction, transformer, hookOpts);

    (global as any)[coverageVariable] = {};

    process.on('exit', () => {
        reportCoverage(coverageVariable, matchFunction, instrumenter, transformer);
    });
}
