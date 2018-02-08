import * as assert from 'assert';
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

suite("CodeMod Tests", () => {
    test("Something 1", () => {
        const text = `const a = 1;
        const c = 1;
        
        function foo() {
            const d = 4;
            const b = 2;
        }
        
        /* enum TestType {
            Foo = 'Foo',
            Bar = 'Bar'
        }
        
        class Test {
            public test(): TestType {
                return TestType.Bar;
            }
        } */
        `;
        /* const j = jscodeshift.withParser({
            parse(code) {
                try {
                    return babylon.parse(code, parserOptions);
                } catch (e) {
                    debugger;
                }
            }
        }); */
        const j = jscodeshift.withParser('babylon');
        const src = j(text);
        let result;
        try {
            result = src.find(j.FunctionDeclaration);
            if (result.length > 0) {
                result.nodes()[0].id.name = 'bar';
            }
        } catch (e) {
        }

        let resultText = src.toSource();
        resultText = prettier.format(resultText);
    });
});
