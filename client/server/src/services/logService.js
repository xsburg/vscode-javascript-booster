"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codeService_1 = require("./codeService");
const CHANNEL_NAME = 'JavaScript Booster';
class LogService {
    // private _channel: vscode.OutputChannel;
    constructor() {
        // this._channel = vscode.window.createOutputChannel(CHANNEL_NAME);
    }
    output(message) {
        // tslint:disable-next-line:no-console
        // console.log(`[LogService.output] ${message}`);
        codeService_1.default.connection().console.log(`${new Date().toISOString()}: ${message}`);
        // this._channel.appendLine(`${new Date().toISOString()}: ${message}`);
    }
    outputError(message) {
        return this.output(`[error] ${message}`);
    }
}
exports.default = new LogService();
//# sourceMappingURL=logService.js.map