"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRequestId = void 0;
const nanoid_1 = require("nanoid");
const nanoid = (0, nanoid_1.customAlphabet)('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const generateRequestId = () => nanoid();
exports.generateRequestId = generateRequestId;
//# sourceMappingURL=generate-request-id.helper.js.map