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
exports.fetchAllUsers = exports.loginUser = exports.createUser = void 0;
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("../middleware/jwt"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, username, password } = req.body;
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({
                message: 'All fields are required.',
            });
        }
        const existingUser = yield db_1.default.user.findFirst({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const usernameExist = yield db_1.default.user.findUnique({
            where: {
                username
            }
        });
        if (usernameExist) {
            return res.status(400).json({ message: "Usernname already taken" });
        }
        let hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create the user
        const newUser = yield db_1.default.user.create({
            data: {
                firstName,
                lastName,
                email,
                token: "",
                username,
                password: hashedPassword, // Consider hashing this before storing
            }
        });
        res.status(201).json({ message: "User created successfully", user: newUser });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ message: "All fields requried" });
        }
        const userExist = yield db_1.default.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!userExist) {
            return res.status(409).json({ message: "Wrong Credentials" });
        }
        const encryptedPassword = yield bcrypt_1.default.compare(password, userExist.password);
        console.log(encryptedPassword, "sdsad");
        if (!encryptedPassword) {
            return res.status(409).json({ message: "Wrong credentials" });
        }
        const token = jwt_1.default.sign({
            id: userExist.id,
            email: userExist.email,
            username: userExist.username,
        });
        const updatedUser = yield db_1.default.user.update({
            where: {
                id: userExist.id,
            },
            data: {
                token
            },
        });
        res.status(200).json({ message: "Login Successfull", updatedUser });
    }
    catch (error) {
        res.status(520).json({ message: "Network Error", error });
    }
});
exports.loginUser = loginUser;
const fetchAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield db_1.default.user.findMany({ where: { isAdmin: false } });
        res.status(201).json({ message: "All Users are fetched succesfully", Users });
    }
    catch (error) {
        console.error("Error fetching Users", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.fetchAllUsers = fetchAllUsers;
//# sourceMappingURL=user.controller.js.map