# Change Log

All notable changes to the "vscode-javascript-booster" extension will be documented in this file.

<!-- Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file. -->

### 0.4.0

Added new inline code actions.

* Flip ?:
* Convert function to arrow function
* Convert const -> let

## 0.3.0

* Added new smart selection commands for JavaScript and TypeScript (with behavior very close to those in WebStorm). When used in other languages, the fallback commands defined in settings are used.

    * `javascriptBooster.extendSelection`
    * `javascriptBooster.shrinkSelection`

* Added a command to run global code actions.
* Added support for external code actions, you can run them from a directory inside your workspace (the directory path is defined is settings, `/codemods` by default).

## 0.2.0 (Initial release)

Added the following inline code actions. The list will keep expanding in later releases.

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
