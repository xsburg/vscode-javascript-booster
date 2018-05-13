import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';
import { CodeModCodeActionProvider } from '../src/CodeModCodeActionProvider';
import { commandIds } from '../src/const';
import { executeCodeActionCommand } from '../src/executeCodeActionCommand';
import langService from '../src/services/langService';

function getWorkspaceFilePath(workspaceName: string, relativeFilePath: string) {
    return path.join(__dirname, `__${workspaceName}__`, relativeFilePath);
}

function createDiagnosticsMock(): vscode.CodeActionContext {
    return { diagnostics: [] };
}

function createCancellationTokenMock(): vscode.CancellationToken {
    return { isCancellationRequested: false, onCancellationRequested: () => ({} as any) };
}

function createSelectionFromPos(line: number, col: number) {
    return new vscode.Selection(
        new vscode.Position(line - 1, col - 1),
        new vscode.Position(line - 1, col - 1)
    );
}

suiteSetup(async () => {
    // trigger the extension and give some time for the language server to start
    vscode.commands.executeCommand(commandIds.reloadCodeMods);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await langService.ready();
});

suite(`Integration tests`, () => {
    test('CodeActionProvider should suggest code action', async () => {
        const fileUri = vscode.Uri.file(getWorkspaceFilePath('simple-workspace', 'file1.js'));
        const textDocument = await vscode.workspace.openTextDocument(fileUri);
        const editor = await vscode.window.showTextDocument(textDocument);

        editor.selection = createSelectionFromPos(2, 19);

        const codeActionProvider = new CodeModCodeActionProvider();
        const codeActions = await codeActionProvider.provideCodeActions(
            textDocument,
            new vscode.Range(0, 0, 0, 0),
            createDiagnosticsMock(),
            createCancellationTokenMock()
        );

        assert.equal(codeActions.length, 1);
        assert.equal(codeActions[0].title, 'Convert to shorthand arrow function');
        assert.equal(codeActions[0].arguments!.length, 3);
    });

    test('runCodeModCommand should update text in editor', async () => {
        const fileUri = vscode.Uri.file(getWorkspaceFilePath('simple-workspace', 'file1.js'));
        const textDocument = await vscode.workspace.openTextDocument(fileUri);
        const editor = await vscode.window.showTextDocument(textDocument);

        editor.selection = createSelectionFromPos(2, 19);

        const codeActionProvider = new CodeModCodeActionProvider();
        const codeActions = await codeActionProvider.provideCodeActions(
            textDocument,
            new vscode.Range(0, 0, 0, 0),
            createDiagnosticsMock(),
            createCancellationTokenMock()
        );

        const [arg1, arg2, arg3] = codeActions[0].arguments!;
        await executeCodeActionCommand(arg1, arg2, arg3);

        const actualText = textDocument.getText();
        assert.equal(
            actualText.trim(),
            `
function test() {
    const a = () => dispatch({
        type: 'FOO'
    });
}
            `.trim()
        );
    });
});
