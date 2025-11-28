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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {JwtPayload} from "jsonwebtoken"; 
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import config from "../config";
const db_1 = __importDefault(require("../db/db"));
const jwtConfig = {
    sign(payload) {
        console.log("payload", payload);
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY);
        return token;
    },
    verifyUser(req, res, next) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "You need to login first" });
                    }
                    else {
                        const user = yield db_1.default.user.findFirst({
                            where: {
                                token
                            }
                        });
                        if (user) {
                            res.locals.user = user;
                            next();
                        }
                        else {
                            return res.status(401).json({ message: "You need to login first" });
                        }
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You need to login first" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).json({ error: "Network Error" });
        }
    },
    verifyAdmin(req, res, next) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                console.log(token, "token");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    console.log("decoded", decoded);
                    if (err) {
                        res.status(401).json({ message: "You need to login first", err });
                    }
                    else {
                        const user = yield db_1.default.user.findFirst({
                            where: {
                                id: decoded.id
                            }
                        });
                        if (user) {
                            if (user.isAdmin) {
                                res.locals.user = user;
                                console.log(user, "user");
                                next();
                            }
                            else {
                                return res.status(401).json({ message: "You need to login first" });
                            }
                        }
                        else {
                            return res.status(401).json({ message: "You need to login first" });
                        }
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You need to login first" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).json({ error: "Network Error" });
        }
    },
    logOut(req, res) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "You are not authorized" });
                    }
                    else {
                        const fetchUser = yield db_1.default.user.findFirst({
                            where: {
                                token: token
                            }
                        });
                        const updatedUser = yield db_1.default.user.update({
                            where: {
                                id: fetchUser.id
                            },
                            data: {
                                token: null
                            }
                        });
                        return res.status(200).json({ message: "User Logged out", updatedUser });
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You are not authorized" });
            }
        }
        catch (error) {
            res.status(520).json({ error: "Network Error" });
        }
    },
    authGuard(req, res) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                console.log(res.locals.user);
                const [bearer, token] = authHeader.split(" ");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ message: "You are not authorized" });
                    }
                    else {
                        const user = yield db_1.default.user.findFirst({
                            where: {
                                token
                            }
                        });
                        if (user) {
                            return res.status(200).json({ message: "User Authorized" });
                        }
                        return res.status(200).json({ message: "You are not authorized" });
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You are not authorized" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).json({ error: "Network Error" });
        }
    },
    autoLogin(req, res) {
        var _a;
        const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        try {
            if (authHeader) {
                const [bearer, token] = authHeader.split(" ");
                jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    console.log(decoded);
                    if (err) {
                        res.status(401).json({ message: "You are not authorized" });
                    }
                    else {
                        // const user = await prisma.user.findFirst({
                        //   where: {
                        //     token: token
                        //   },
                        // })
                        // if (!user) {
                        //   return res.status(401).json({ message: "You are not authorized" });
                        // }
                        const { id } = decoded, details = __rest(decoded, ["id"]);
                        return res.status(200).json({ message: "Logged in Succesfully", user: details });
                    }
                }));
            }
            else {
                res.status(401).json({ message: "You are not authorized" });
            }
        }
        catch (error) {
            // console.log(err);
            res.status(520).json({ error: "Network Error" });
        }
    },
};
exports.default = jwtConfig;
//# sourceMappingURL=jwt.js.map