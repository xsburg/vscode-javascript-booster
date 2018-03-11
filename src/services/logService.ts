import * as vscode from 'vscode';

const CHANNEL_NAME = 'JavaScript Booster';

class LogService {
    private _channel: vscode.OutputChannel;

    constructor() {
        this._channel = vscode.window.createOutputChannel(CHANNEL_NAME);
    }

    public output(message: string) {
        console.log(`[LogService.output] ${message}`);
        this._channel.appendLine(`${new Date().toISOString()}: ${message}`);
    }

    public outputError(message: string) {
        return this.output(`[error] ${message}`);
    }
}

export default new LogService();
