# VS Code JavaScript Booster [![Travis](https://img.shields.io/travis/xsburg/vscode-javascript-booster.svg?style=flat)](https://travis-ci.org/xsburg/vscode-javascript-booster)

Make your life easier, use code actions to do repetitive tasks for you! They can help a lot, just follow the light bulb [💡]!

This VS Code extension provides various code actions (quick fixes) when editing code in JavaScript (or TypeScript/Flow). Just note the light bulb at the left and press it to learn how you can transform the code under the cursor.

You might want to reassign the default shortcut for the quick fix menu to `Alt+Enter` if you are moving from WebStorm. Search for `editor.action.quickFix` command.

![Features](resources/features.gif)

## Installation

Install through VS Code extensions. Search for `JavaScript Booster`

[Visual Studio Code Market Place: JavaScript Booster](https://marketplace.visualstudio.com/items?itemName=sburg.vscode-javascript-booster)

## Features

### Code actions

* 💥 Flip if-else
* 💥 Remove redundant else
* 💥 Replace if-else with ?:
* 💥 Flip ?:
* 💥 Convert shorthand arrow function to statement
* 💥 Convert to shorthand arrow function
* 💥 Add parens to single arrow function parameter
* 💥 Convert function to arrow function
* 💥 Replace string with template string
* 💥 Replace template string with regular string
* 💥 JSX: Wrap value with {} (JSX attributes)
* 💥 JSX: Remove {} from JSX attribute
* 💥 JSX: Collapse/Expand empty tag
* 💥 Convert var/const to let
* 💥 Convert var to const
* 💥 Split into multiple declarations
* 💥 Split into declaration and initialisation
* 💥 Merge declaration and initialisation

### Extend/Shrink selections

These two commands allow you to successively select blocks of code so that it's easier to select what you want. Just look at the animation, rather than read this text 🤓. Unlike VS Code's embedded commands (`editor.action.smartSelect.*`), this extension uses an abstract syntax tree under the hood, which provides much more accurate results.

You might want to assign hotkeys for these commands, search for `javascriptBooster.extendSelection` and `javascriptBooster.shrinkSelection`. `Ctrl+W` and `Ctrl+Shift+W` (⌘W and ⌘⇧W) are used in WebStorm by default.

![Smart extend/shrink selection](resources/smartSelection.gif)

As this feature is only supported in JavaScript and TypeScript for now, you can configure fallback commands that will be called for other file types instead (VS Code's `smartSelect.*` by default). They will also be called if the file has fatal syntax errors.

<!-- ### Run your own code actions (beta)

You can easily load and run your own code actions. -->

## Roadmap

### More code actions

* Convert if -> switch-case
* TS: Change member access (public -> private etc)
* TS: Convert alias to interface
* TS: Generate missing switch cases for enum
* ...?

### New commands

* Duplicate line/selection
* Navigate to related files (Hello.jsx -> Hello.scss, Hello.spec.jsx)

### Others

* Highlight unused imports
* Support loading code actions from user workspace: users can create their own, project-related refactorings! 😅

## Inspiration

Largely inspired by [WebStorm](https://www.jetbrains.com/webstorm) and its variety of code refactorings. The extension uses [Babylon](https://github.com/babel/babel/tree/master/packages/babylon) to parse the code and then manipulates the abstract syntax tree using [jscodeshift](https://github.com/facebook/jscodeshift).

## Release Notes

### 0.5.0

* Added new inline code actions.

    * Add parens to arrow function parameter
    * Remove braces from JSX attribute

* Added support for multiple cursors in smart selection commands.
* Changed `Replace if-else with ?:` action: it now supports if-return-else-return scenario.
* Fixed `Collapse/Expand empty tag` action: it previously didn't work when the element is nested into a JSX attribute.

### 0.4.0

* Added new inline code actions.

    * Flip ?:
    * Convert function to arrow function
    * Convert const -> let
    * JSX: Collapse/Expand empty tag

* Added support for TypeScript 2.7 (definite assignment assertion modifier in class property definitions) through upgrading to the latest Babylon.

* Changed `Split into declaration and initialization` action: it can now split const declarations.

* Fixed #1: Sequence of string literals doesn't convert properly when transforming to template literal.

* Fixed smart selection extension for collapsed JSX elements.

### 0.3.0

* Added new smart selection commands for JavaScript and TypeScript (with behavior very close to those in WebStorm). When used in other languages, the fallback commands defined in settings are used.

    * `javascriptBooster.extendSelection`
    * `javascriptBooster.shrinkSelection`

* Added a command to run global code actions.
* Added support for external code actions, you can run them from a directory inside your workspace (the directory path is defined is settings, `/codemods` by default).

### 0.2.0 (Initial release)

* Added the following inline code actions. The list will keep expanding in later releases.

    * Flip if-else
    * Remove redundant else
    * Replace if-else with ?:
    * Convert shorthand arrow function to statement
    * Convert to shorthand arrow function
    * Replace string with template string
    * Replace template string with regular string
    * Wrap value with {} (JSX attributes)
    * Convert var to let
    * Convert var to const
    * Split into multiple declarations
    * Split into declaration and initialisation
    * Merge declaration and initialisation

<!-- ## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

* Fix canRun() for string literals in enums
* Allow Split declaration & initialization for const variables, makes little sense otherwise if const used everywhere

 -->
