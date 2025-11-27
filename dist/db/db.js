"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
//it is a good practice to not create the instance of this prisma client again and again so  we create it only one time
exports.default = prisma;
//# sourceMappingURL=db.js.map