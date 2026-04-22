"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const connection_1 = require("../connection");
function connect(config) {
    try {
        (0, connection_1.createPool)(config);
        return { success: true, message: 'Connected to MySQL' };
    }
    catch (error) {
        throw new Error(`Failed to connect: ${error}`);
    }
}
//# sourceMappingURL=connect.js.map