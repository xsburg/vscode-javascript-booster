'use strict';
import { ExtensionContext, commands, window, workspace, Range } from 'vscode';
import * as vscode from 'vscode';
import * as jscodeshift from 'jscodeshift';
import * as prettier from 'prettier';

const babylon = require('babylon');
const parserOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  plugins: [
    'jsx',
    'typescript',
    'asyncFunctions',
    'classConstructorCall',
    'doExpressions',
    'trailingFunctionCommas',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportExtensions',
    'exponentiationOperator',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
  ],
};

export class MyCodeActionProvider implements vscode.CodeActionProvider {
	public provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext, token: vscode.CancellationToken): Thenable<vscode.Command[]> {
        console.log('code action checker!');
        return Promise.resolve([
            {
                title: 'Code Action 1',
                tooltip: 'Code Action 1 Tooltip',
                command: 'extension.sayCodeAction',
                arguments: [
                    'foo',
                    {
                        a: 2
                    }
                ]
            }
        ] as vscode.Command[]);
		/* let promises = context.diagnostics.map(diag => {
			// When a name is not found but could refer to a package, offer to add import
			if (diag.message.indexOf('undefined: ') === 0) {
				let [_, name] = /^undefined: (\S*)/.exec(diag.message);
				return listPackages().then(packages => {
					let commands = packages
						.filter(pkg => pkg === name || pkg.endsWith('/' + name))
						.map(pkg => {
							return {
								title: 'import "' + pkg + '"',
								command: 'go.import.add',
								arguments: [pkg]
							};
						});
					return commands;
				});
			}
			return [];
		});

		return Promise.all(promises).then(arrs => {
			let results = {};
			for (let segment of arrs) {
				for (let item of segment) {
					results[item.title] = item;
				}
			}
			let ret = [];
			for (let title of Object.keys(results).sort()) {
				ret.push(results[title]);
			}
			return ret;
		}); */
	}
}

export function activate(context: ExtensionContext) {
    window.onDidChangeActiveTextEditor((event) => {
        console.log('change TE!');
    }, this, context.subscriptions);
    workspace.onDidSaveTextDocument(() => {
        console.log('change TD!');
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        const text = window.activeTextEditor.document.getText();
        /* const j = jscodeshift.withParser({
            parse(code) {
                try {
                    return babylon.parse(code, parserOptions);
                } catch (e) {
                    debugger;
                }
            }
        });
        const src = j(text); */
        const j = jscodeshift.withParser('babylon');
        const src = j(text);
        let result;
        try {
            result = src.find(j.FunctionDeclaration);
            if (result.length > 0) {
                result.nodes()[0].id.name = 'bar';
            }
        } catch (e) {
            debugger;
        }

        let resultText = src.toSource();
        resultText = prettier.format(resultText);

        const document = window.activeTextEditor.document;
        const r = new Range(
            document.positionAt(0),
            document.positionAt(text.length - 1)
        );
        window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(r, resultText);
        });
        // Display a message box to the user
        //window.showInformationMessage('Hello World!');
    });
    let disposable2 = commands.registerCommand('extension.sayCodeAction', (a1, a2) => {
        debugger;
    });

    context.subscriptions.push(vscode.languages.registerCodeActionsProvider([
        'typescript',
        'typescriptreact',
        'javascript',
        'javascriptreact'
    ], new MyCodeActionProvider()));

    context.subscriptions.push(disposable, disposable2);
}

export function deactivate() {
}
/* 
import * as vscode from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

	console.log('decorator sample is activated');

	// create a decorator type that we use to decorate small numbers
	const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
		borderWidth: '1px',
		borderStyle: 'solid',
		overviewRulerColor: 'blue',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        color: 'red',
        
		light: {
			// this color will be used in light color themes
			borderColor: 'darkblue'
		},
		dark: {
			// this color will be used in dark color themes
			borderColor: 'lightblue'
		}
	});

	// create a decorator type that we use to decorate large numbers
	const largeNumberDecorationType = vscode.window.createTextEditorDecorationType({
		cursor: 'crosshair',
		backgroundColor: 'rgba(255,0,0,0.3)'
	});

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	var timeout = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const regEx = /\d+/g;
		const text = activeEditor.document.getText();
		const smallNumbers: vscode.DecorationOptions[] = [];
		const largeNumbers: vscode.DecorationOptions[] = [];
		let match;
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
			if (match[0].length < 3) {
				smallNumbers.push(decoration);
			} else {
				largeNumbers.push(decoration);
			}
		}
		activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
		activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
	}
} */