import { IConnection } from 'vscode-languageserver';

class CodeService {
    private _connection!: IConnection;

    public initialize(connection: IConnection) {
        this._connection = connection;
    }

    public connection() {
        return this._connection;
    }
}

export default new CodeService();
