import {
    Command,
    CompletionItem,
    CompletionItemKind,
    createConnection,
    Diagnostic,
    DiagnosticSeverity,
    IConnection,
    InitializeResult,
    IPCMessageReader,
    IPCMessageWriter,
    TextDocument,
    TextDocumentPositionParams,
    TextDocuments
} from 'vscode-languageserver';
import { commandIds } from './const';
import astService, { LanguageId } from './services/astService';
import codeModService from './services/codeModService';
import codeService from './services/codeService';

let connection: IConnection = createConnection(
    new IPCMessageReader(process),
    new IPCMessageWriter(process)
);

codeService.initialize(connection);

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

connection.onInitialize((_params): InitializeResult => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            codeActionProvider: true,
            executeCommandProvider: {
                commands: ['javascriptBooster.test1']
            }
        }
    };
});

documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

interface JavaScriptBoosterSettings {
    codemodDir: string;
}

let settings: JavaScriptBoosterSettings;
connection.onDidChangeConfiguration(change => {
    settings = change.settings.javascriptBooster as JavaScriptBoosterSettings;
    documents.all().forEach(validateTextDocument);
});

function validateTextDocument(textDocument: TextDocument): void {
    let diagnostics: Diagnostic[] = [];
    let lines = textDocument.getText().split(/\r?\n/g);
    let problems = 0;
    for (let i = 0; i < lines.length && problems < 100; i++) {
        let line = lines[i];
        let index = line.indexOf('typescript');
        if (index >= 0) {
            problems++;

            let diagnosic: Diagnostic = {
                severity: DiagnosticSeverity.Warning,
                range: {
                    start: { line: i, character: index },
                    end: { line: i, character: index + 10 }
                },
                message: `${line.substr(index, 10)} should be spelled TypeScript`,
                source: 'ex'
            };
            if (true) {
                diagnosic.relatedInformation = [
                    {
                        location: {
                            uri: textDocument.uri,
                            range: {
                                start: { line: i, character: index },
                                end: { line: i, character: index + 10 }
                            }
                        },
                        message: 'Spelling matters'
                    },
                    {
                        location: {
                            uri: textDocument.uri,
                            range: {
                                start: { line: i, character: index },
                                end: { line: i, character: index + 10 }
                            }
                        },
                        message: 'Particularly for names'
                    }
                ];
            }
            diagnostics.push(diagnosic);
        }
    }
    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onCodeAction(async params => {
    const document = documents.get(params.textDocument.uri);
    if (!astService.isSupportedLanguage(document.languageId)) {
        return [];
    }

    const source = document.getText();
    // const activeTextEditor = vscode.window.activeTextEditor!;
    const codeMods = await codeModService.getCodeActionMods({
        languageId: document.languageId as LanguageId,
        fileName: document.uri,
        source,
        selection: {
            anchor: astService.offsetAt(source, params.range.start),
            active: astService.offsetAt(source, params.range.end)
            // anchor: astService.offsetAt(source, activeTextEditor.selection.anchor),
            // active: astService.offsetAt(source, activeTextEditor.selection.active)
        }
    });
    return codeMods.map(
        mod =>
            ({
                title: mod.name,
                command: commandIds.runCodeMod,
                arguments: [mod]
            } as Command)
    );
});

connection.onExecuteCommand(async params => {
    const command = params.command;
    /* const versionedTextDocumentIdentifier = params.arguments[0];
    connection.workspace.applyEdit({
        documentChanges: [{
            textDocument: versionedTextDocumentIdentifier,
            edits: [{
                range: {
                    start: {line: 0, character: 0},
                    end: {line: Number.MAX_SAFE_INTEGER, character: Number.MAX_SAFE_INTEGER}
                },
                newText: this.documents.get(versionedTextDocumentIdentifier.uri).getText().toUpperCase()
            }]
        }]
    }); */
});

connection.listen();
