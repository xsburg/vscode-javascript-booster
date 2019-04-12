import * as assert from 'assert';
import * as os from 'os';
import * as vscode from 'vscode-languageserver-types';
import astService from '../src/services/astService';

describe('astService', () => {
    const eolLength = os.EOL.length;

    it('Should support decorators', () => {
        const actual = astService.getAstTree({
            languageId: 'typescript',
            fileName: 'foo.ts',
            source: `
                    import { Component } from '@angular/core';

                    @Component({
                        selector: 'app-root',
                        templateUrl: './app.component.html',
                        styleUrls: ['./app.component.css']
                    })
                    export class AppComponent {
                        title = 'Tour of Heroes';
                    }
                `
        });

        expect(actual).toBeTruthy();
    });

    it('offsetAt() should compute line', () => {
        const actual = astService.offsetAt(
            `let a;\nlet b;\r\nlet c;\nlet d;`,
            vscode.Position.create(3, 0)
        );
        const expected = (6 + eolLength) * 3;

        assert.equal(actual, expected, 'offsets must match');
    });

    it('offsetAt() should compute character', () => {
        const actual = astService.offsetAt(`let a;\nlet b;`, vscode.Position.create(1, 4));
        const expected = 6 + os.EOL.length + 4;

        assert.equal(actual, expected, 'offsets must match');
    });

    it('positionAt() should compute line', () => {
        const actual = astService.positionAt(
            `let a;\nlet b;\r\nlet c;\nlet d;`,
            (6 + eolLength) * 3
        );
        const expected = vscode.Position.create(3, 0);

        assert.equal(actual.line, expected.line, 'lines must match');
        assert.equal(actual.character, expected.character, 'characters must match');
    });

    it('positionAt() should compute character', () => {
        const actual = astService.positionAt(`let a;\nlet b;`, 6 + os.EOL.length + 4);
        const expected = vscode.Position.create(1, 4);

        assert.equal(actual.line, expected.line, 'lines must match');
        assert.equal(actual.character, expected.character, 'characters must match');
    });
});
