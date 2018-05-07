"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeService {
    initialize(connection) {
        this._connection = connection;
    }
    connection() {
        return this._connection;
    }
}
exports.default = new CodeService();
//# sourceMappingURL=codeService.js.map