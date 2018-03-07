# JavaScript Booster

Provides UI to run [jscodeshift](https://github.com/facebook/jscodeshift) transformations inside VS Code. Cursor position is passed via `startPos` / `endPos` options and can be used inside the transform function.

Define your own refactorings using jscodeshift API.

## Features

A few codemods are already included into the extension. To extend this list, create a `codemods` directory in your workspace and put your transformations in there.

![Run CodeMod Command](images/runCodeMod.gif)

## TODO

Refactorings:

* ~~Flip if~~
* ~~Convert lambda expression to lambda statement~~
* Convert to shorthand arrow fn
* Remove else statement
* Convert String to Template String
* Merge declaration and initialisation (for let & const)
* Split into declaration and initialisation
* Wrap value with {} (JSX attributes)
* Replace if-else with ?:
* Replace with template string ('foo' + bar => `${foo}bar`)

Commands:

* Extend/Shrink selection
* Duplicate line/selection

<!-- ## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.
 -->
