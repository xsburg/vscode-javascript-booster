/**
 * Developer: Stepan Burguchev
 * Date: 11/16/2017
 * Copyright: 2015-present ApprovalMax
 *       All Rights Reserved
 *
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF ApprovalMax
 *       The copyright notice above does not evidence any
 *       actual or intended publication of such source code.
 */

/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const fs = require('fs-extra');
const path = require('path');

expect.addSnapshotSerializer({
    test: val => {
        return val.type === 'codemod-fixture-snapshot';
    },
    print: val => {
        return val.data;
    }
});

export function runInlineTest(module, options, input, snapshotName = undefined) {
    // Handle ES6 modules using default export for the transform
    const transform = module.default ? module.default : module;

    // Jest resets the module registry after each test, so we need to always get
    // a fresh copy of jscodeshift on every test run.
    let jscodeshift = require('jscodeshift');
    if (module.parser) {
        jscodeshift = jscodeshift.withParser(module.parser);
    }

    const output = transform(
        input,
        {
            jscodeshift,
            stats: () => {}
        },
        options || {}
    );
    expect({
        type: 'codemod-fixture-snapshot',
        data: (output || '').trim()
    }).toMatchSnapshot(snapshotName);
}

/**
 * Utility function to run a jscodeshift script within a unit test. This makes
 * several assumptions about the environment:
 *
 * - `dirName` contains the name of the directory the test is located in. This
 *   should normally be passed via __dirname.
 * - The test should be located in a subdirectory next to the transform itself.
 *   Commonly tests are located in a directory called __tests__.
 * - `transformName` contains the filename of the transform being tested,
 *   excluding the .js extension.
 * - `testFilePrefix` optionally contains the name of the file with the test
 *   data. If not specified, it defaults to the same value as `transformName`.
 *   This will be suffixed with ".input.js" for the input file and ".output.js"
 *   for the expected output. For example, if set to "foo", we will read the
 *   "foo.input.js" file, pass this to the transform, and expect its output to
 *   be equal to the contents of "foo.output.js".
 * - Test data should be located in a directory called __testfixtures__
 *   alongside the transform and __tests__ directory.
 */
export function runTest(dirName, transformName, options, snapshotName = undefined) {
    const fixtureDir = path.join(dirName, '..', '__testfixtures__');
    const inputPath = path.join(
        fixtureDir,
        snapshotName ? `${transformName}.${snapshotName}.fixture.js` : `${transformName}.fixture.js`
    );
    const source = fs.readFileSync(inputPath, 'utf8');
    // Assumes transform is one level up from __tests__ directory
    const module = require(path.join(dirName, '..', `${transformName}.js`));
    runInlineTest(
        module,
        options,
        {
            path: inputPath,
            source
        },
        snapshotName
    );
}

/**
 * Handles some boilerplate around defining a simple jest/Jasmine test for a
 * jscodeshift transform.
 */
export function defineTest(dirName, transformName, options, snapshotName = undefined) {
    const testName = snapshotName
        ? `transforms correctly using "${snapshotName}" data`
        : 'transforms correctly';
    describe(transformName, () => {
        it(testName, () => {
            runTest(dirName, transformName, options, snapshotName);
        });
    });
}
