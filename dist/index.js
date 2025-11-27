"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db/db"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const adminTemplate_routes_1 = __importDefault(require("./routes/adminTemplate.routes"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.body = buf;
    },
}));
app.use("/api", user_routes_1.default);
app.use("/api", adminTemplate_routes_1.default);
const port = process.env.PORT || 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield db_1.default.user.findMany({ take: 10 });
        res.status(200).json({ message: 'Users fetched', courses });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on http://localhost:${port} `);
}));
exports.default = app;
//# sourceMappingURL=index.js.map