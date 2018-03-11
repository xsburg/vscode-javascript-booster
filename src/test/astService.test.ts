import * as assert from 'assert';
import { window, Position } from 'vscode';
import * as os from 'os';
import astService from '../services/astService';

suite('astService', () => {
    const eolLength = os.EOL.length;

    test('offsetAt() should compute line', () => {
        const actual = astService.offsetAt(`let a;\nlet b;\r\nlet c;\nlet d;`, new Position(3, 0));
        const expected = (6 + eolLength) * 3;

        assert.equal(actual, expected, 'offsets must match');
    });

    test('offsetAt() should compute character', () => {
        const actual = astService.offsetAt(`let a;\nlet b;`, new Position(1, 4));
        const expected = 6 + os.EOL.length + 4;

        assert.equal(actual, expected, 'offsets must match');
    });

    test('positionAt() should compute line', () => {
        const actual = astService.positionAt(
            `let a;\nlet b;\r\nlet c;\nlet d;`,
            (6 + eolLength) * 3
        );
        const expected = new Position(3, 0);

        assert.equal(actual.line, expected.line, 'lines must match');
        assert.equal(actual.character, expected.character, 'characters must match');
    });

    test('positionAt() should compute character', () => {
        const actual = astService.positionAt(`let a;\nlet b;`, 6 + os.EOL.length + 4);
        const expected = new Position(1, 4);

        assert.equal(actual.line, expected.line, 'lines must match');
        assert.equal(actual.character, expected.character, 'characters must match');
    });
});
