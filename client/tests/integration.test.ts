import * as assert from 'assert';
import * as path from 'path';
import * as vscode from 'vscode';

import { CodeModCodeActionProvider } from '../src/CodeModCodeActionProvider';
import { executeCodeActionCommand } from '../src/executeCodeActionCommand';
import langService from '../src/services/langService';

function getWorkspaceFilePath(workspaceName: string, relativeFilePath: string) {
    const testWorkspacesDir = process.env.TEST_WORKSPACES_DIR;
    if (!testWorkspacesDir) {
        throw new Error('TEST_WORSPACES_DIR variable is not set.');
    }
    return path.join(testWorkspacesDir, `__${workspaceName}__`, relativeFilePath);
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

async function openFileInEditor(filePath: string) {
    const fileUri = vscode.Uri.file(getWorkspaceFilePath('simple-workspace', 'file1.js'));
    const textDocument = await vscode.workspace.openTextDocument(fileUri);
    const editor = await vscode.window.showTextDocument(textDocument);
    // Opening the document triggers this extension to start.
    // Wait until the language server has started.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await langService.ready();
    return { fileUri, textDocument, editor };
}

suite(`Integration tests`, () => {
    test('CodeActionProvider should suggest code action', async () => {
        const { textDocument, editor } = await openFileInEditor(
            getWorkspaceFilePath('simple-workspace', 'file1.js')
        );

        editor.selection = createSelectionFromPos(2, 19);

        const codeActionProvider = new CodeModCodeActionProvider();
        const codeActions = await codeActionProvider.provideCodeActions(
            textDocument,
            editor.selection,
            createDiagnosticsMock(),
            createCancellationTokenMock()
        );

        const convertToArrowAction = codeActions.find(
            (ca) => ca.title === 'Convert to shorthand arrow function'
        );
        assert.equal(codeActions.length >= 1, true);
        assert.equal(Boolean(convertToArrowAction), true);
        assert.equal(convertToArrowAction!.arguments!.length, 3);
    });

    test('runCodeModCommand should update text in editor', async () => {
        const { textDocument, editor } = await openFileInEditor(
            getWorkspaceFilePath('simple-workspace', 'file1.js')
        );

        editor.selection = createSelectionFromPos(2, 19);

        const codeActionProvider = new CodeModCodeActionProvider();
        const codeActions = await codeActionProvider.provideCodeActions(
            textDocument,
            editor.selection,
            createDiagnosticsMock(),
            createCancellationTokenMock()
        );

        const convertToArrowAction = codeActions.find(
            (ca) => ca.title === 'Convert to shorthand arrow function'
        )!;
        assert.equal(convertToArrowAction.arguments!.length, executeCodeActionCommand.length);

        await (executeCodeActionCommand as any)(...convertToArrowAction.arguments!);

        const actualText = textDocument.getText();
        assert.equal(
            actualText.trim(),
            `
function test() {
    const a = () => dispatch({
        type: 'FOO',
    });
}
            `.trim()
        );
    });
});
