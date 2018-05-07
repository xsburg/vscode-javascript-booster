"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const const_1 = require("./const");
const astService_1 = require("./services/astService");
const codeModService_1 = require("./services/codeModService");
const codeService_1 = require("./services/codeService");
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
codeService_1.default.initialize(connection);
let documents = new vscode_languageserver_1.TextDocuments();
documents.listen(connection);
connection.onInitialize((_params) => {
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
let settings;
connection.onDidChangeConfiguration(change => {
    settings = change.settings.javascriptBooster;
    documents.all().forEach(validateTextDocument);
});
function validateTextDocument(textDocument) {
    let diagnostics = [];
    let lines = textDocument.getText().split(/\r?\n/g);
    let problems = 0;
    for (let i = 0; i < lines.length && problems < 100; i++) {
        let line = lines[i];
        let index = line.indexOf('typescript');
        if (index >= 0) {
            problems++;
            let diagnosic = {
                severity: vscode_languageserver_1.DiagnosticSeverity.Warning,
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
connection.onCodeAction((params) => __awaiter(this, void 0, void 0, function* () {
    const document = documents.get(params.textDocument.uri);
    if (!astService_1.default.isSupportedLanguage(document.languageId)) {
        return [];
    }
    const source = document.getText();
    // const activeTextEditor = vscode.window.activeTextEditor!;
    const codeMods = yield codeModService_1.default.getCodeActionMods({
        languageId: document.languageId,
        fileName: document.uri,
        source,
        selection: {
            anchor: astService_1.default.offsetAt(source, params.range.start),
            active: astService_1.default.offsetAt(source, params.range.end)
            // anchor: astService.offsetAt(source, activeTextEditor.selection.anchor),
            // active: astService.offsetAt(source, activeTextEditor.selection.active)
        }
    });
    return codeMods.map(mod => ({
        title: mod.name,
        command: const_1.commandIds.runCodeMod,
        arguments: [mod]
    }));
}));
connection.onExecuteCommand((params) => __awaiter(this, void 0, void 0, function* () {
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
}));
connection.listen();
//# sourceMappingURL=server.js.map