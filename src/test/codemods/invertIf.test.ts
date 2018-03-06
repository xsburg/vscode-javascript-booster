import * as assert from 'assert';
import * as vscode from 'vscode';
import * as jscodeshift from 'jscodeshift';
import { defineTransformTest, defineCanRunTest } from '../utils/testHelpers';

defineCanRunTest(__dirname, 'invertIf', false, 'not-if', { pos: { line: 6, column: 9 } });
defineTransformTest(__dirname, 'invertIf', null, { pos: { line: 5, column: 2 } });
