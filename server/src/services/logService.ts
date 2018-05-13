import connectionService from './connectionService';

const CHANNEL_NAME = 'JavaScript Booster';

class LogService {
    // private _channel: vscode.OutputChannel;

    constructor() {
        // this._channel = vscode.window.createOutputChannel(CHANNEL_NAME);
    }

    public output(message: string) {
        // tslint:disable-next-line:no-console
        // console.log(`[LogService.output] ${message}`);
        // connectionService.connection().sendNot
        connectionService.connection().console.log(`${new Date().toISOString()}: ${message}`);
        // this._channel.appendLine(`${new Date().toISOString()}: ${message}`);
    }

    public outputError(message: string) {
        return this.output(`[error] ${message}`);
    }
}

export default new LogService();
