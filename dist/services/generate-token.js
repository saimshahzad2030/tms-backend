"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    const token = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(token);
    return token;
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=generate-token.js.map