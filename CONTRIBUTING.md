# Contributing to VSCode Javascript Booster

Before you start, it's useful to understand that the extension consists of two major components: the extension itself and the so-called language server. All UI interactions with VS Code are conducted inside the extension part, while all the code-analyzing logic is hidden inside the language server - a separate process to handle resource-heavy operations.

Following this architecture, below are the main scenarious that you might come across while working on this project.

-   Debugging the extension (which is: launching VS Code and this extension in debug mode)
-   Debugging the language server
-   Running integration tests (to check that all the pieces work together)
-   Running unit tests of the language server (to build new features: code actions etc.)
-   Building a Release Candidate bundle (for purpose of long-term local testing)

## Debugging the extension

-   Compile the language server: go to the `server` directory and run `npm run compile`.
-   Start the configuration `Launch client (client)`.

## Debugging the language server

-   Start extension in debug mode using the previous step.
-   Start the additional configuration `Attach to Server (server)` in parallel to `Launch client (client)`.

## Running integration tests

-   Compile the language server: go to the `server` directory and run `npm run compile`.
-   Start the configuration `Extension tests (client)`.

## Running unit tests of the language server

Running the unit tests in watch mode:

-   Go to the `server` directory and run `npm test -- --watch`.

Debugging the unit tests:

-   Start the configuration `Server Tests (server)`.

## Building a Release Candidate bundle

`vsce` (Visual Studio Code Extensions) CLI has to be installed in order to build the extension locally (`npm i -g vsce`).

The following commands build the extension package:

-   Bump the version in `client/package.json` (don't forget to revert the change later)
-   In the root repository dir, run `npm run package`

The extension bundle (\*.vsix) will be created in the `client` directory.

After that, you can load the bundle by going to the extensions tab in VS Code and choosing 'Install from VSIX...'. If the extension has already been installed from the Marketplace, it will be overwritten.

## Pre-flight checklist

All releases are made using release branches, e.g. `release/0.11.0`.

-   Update README.md in the root directory:
    -   Add new changelog entry
    -   Add new code actions into the list
    -   Check if other changes are needed
-   Place all the resources (gifs, etc) into the `resources` dir.
-   Run `npm run utils:generate:docs` to update extension's readme and changelog files.
-   Initiate new release by running the command (in the root dir): `npm version [patch|minor|major]`
-   Merge the release branch into master, delete it and push

## Useful links

-   https://astexplorer.net/ - Explore code as an abstract syntax tree. Select Babylon7 parser to see the right tree. Helps when writing new code actions.
-   https://github.com/facebook/jscodeshift - The engine behind this extension: a set of high-level tools to operate an AST.
-   https://github.com/benjamn/recast - The library used by jscodeshift to mutate and pretty-print the code.
-   https://github.com/benjamn/ast-types - The library under the hood of recast and jscodeshift.
