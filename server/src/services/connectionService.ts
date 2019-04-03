import {
    createConnection,
    IConnection,
    InitializeResult,
    IPCMessageReader,
    IPCMessageWriter,
    TextDocuments
} from 'vscode-languageserver';
import { codeActionsRequestHandler, codeActionsRequestType } from '../codeActionsRequest';
import { commandIds } from '../const';
import {
    executeTransformRequestHandler,
    executeTransformRequestType
} from '../executeTransformRequest';
import {
    extendSelectionRequestHandler,
    extendSelectionRequestType,
    shrinkSelectionRequestHandler,
    shrinkSelectionRequestType
} from '../smartSelectionRequest';
import codeModService from './codeModService';

interface JavaScriptBoosterSettings {
    codemodDir: string;
    formattingOptions: {
        tabWidth?: number;
        useTabs?: boolean;
        wrapColumn?: number;
        quote?: 'single' | 'double';
        trailingComma?: boolean;
        arrayBracketSpacing?: boolean;
        objectCurlySpacing?: boolean;
        arrowParensAlways?: boolean;
    };
}

class ConnectionService {
    private _connection!: IConnection;
    private _documents!: TextDocuments;
    private _settings!: JavaScriptBoosterSettings;

    public listen() {
        this._connection = createConnection(
            new IPCMessageReader(process),
            new IPCMessageWriter(process)
        );

        this._documents = new TextDocuments();
        this._documents.listen(this._connection);

        this._connection.onInitialize(
            (params): InitializeResult => {
                return {
                    capabilities: {
                        textDocumentSync: this._documents.syncKind,
                        executeCommandProvider: {
                            commands: [commandIds.reloadCodeMods]
                        }
                    }
                };
            }
        );

        this._connection.onDidChangeConfiguration(change => {
            this._settings = change.settings.javascriptBooster as JavaScriptBoosterSettings;
            codeModService.reloadAllCodeMods();
        });

        this._connection.onRequest(codeActionsRequestType, codeActionsRequestHandler);
        this._connection.onRequest(executeTransformRequestType, executeTransformRequestHandler);
        this._connection.onRequest(extendSelectionRequestType, extendSelectionRequestHandler);
        this._connection.onRequest(shrinkSelectionRequestType, shrinkSelectionRequestHandler);

        this._connection.onExecuteCommand(async params => {
            switch (params.command) {
                case commandIds.reloadCodeMods:
                    codeModService.reloadAllCodeMods();
                    break;
                default:
                    break;
            }
        });

        this._connection.listen();
    }

    public connection() {
        return this._connection;
    }

    public getDocument(uri: string) {
        return this._documents.get(uri)!;
    }

    public getSettings() {
        return this._settings;
    }
}

export default new ConnectionService();
