import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import { format, resolveConfig } from 'prettier';
import { Position, window } from 'vscode';
import astService from '../services/astService';

suite('prettier', () => {
    test('should parse example.js', async () => {
        const filePath = path.join(__dirname, '__prettier-fixtures__', 'example.js');
        const options = await resolveConfig(filePath);

        const formattedText = format('', {
            ...(options || {}),
            parser(text, opts) {
                const input = fs.readFileSync(filePath, 'utf8');
                const ast = astService.getAstTree({
                    languageId: 'javascript',
                    fileName: filePath,
                    source: input
                })!;
                const j = astService.getCodeShift('javascript');
                const node = ast.find(j.IfStatement).firstNode()!;
                return node;
            }
        });
    });
});
