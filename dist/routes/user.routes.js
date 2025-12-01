"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
// import { changePasswordOnForget, createUser, sendOtp, getUsers, loginUser, verifyOtp, changePassword, changeInfo, deleteUser } from '../controllers/user.controller';
const jwt_1 = __importDefault(require("../middleware/jwt"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)(); // memory storage
const router = (0, express_1.Router)();
router.route("/user")
    .post(upload.none(), user_controller_1.createUser)
    .get(jwt_1.default.verifyAdmin, upload.none(), user_controller_1.fetchAllUsers);
router.route("/login")
    .post(upload.none(), user_controller_1.loginUser)
    .get(jwt_1.default.autoLogin);
router.route("/user-auth-check")
    .get(upload.none(), jwt_1.default.authGuard);
exports.default = router;
//# sourceMappingURL=user.routes.js.map