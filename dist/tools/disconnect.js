"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = disconnect;
const connection_1 = require("../connection");
async function disconnect() {
    try {
        await (0, connection_1.closePool)();
        return { success: true, message: 'Disconnected from MySQL' };
    }
    catch (error) {
        throw new Error(`Failed to disconnect: ${error}`);
    }
}
//# sourceMappingURL=disconnect.js.map