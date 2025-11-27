"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeBigInt = void 0;
const serializeBigInt = (data) => {
    if (typeof data === 'bigint') {
        return data.toString();
    }
    if (data instanceof Date) {
        return data.toISOString(); // Convert Date to ISO string format
    }
    if (Array.isArray(data)) {
        return data.map(exports.serializeBigInt);
    }
    if (data !== null && typeof data === 'object') {
        return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, (0, exports.serializeBigInt)(value)]));
    }
    return data;
};
exports.serializeBigInt = serializeBigInt;
//# sourceMappingURL=seialize-bigint.js.map