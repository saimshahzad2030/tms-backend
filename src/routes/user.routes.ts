
import { Router } from "express";
import {  createUser, fetchAllUsers, loginUser } from '../controllers/user.controller';
// import { changePasswordOnForget, createUser, sendOtp, getUsers, loginUser, verifyOtp, changePassword, changeInfo, deleteUser } from '../controllers/user.controller';
import jwtConfig from "../middleware/jwt";
 import multer from "multer";
const upload = multer(); // memory storage

const router = Router()
 
router.route("/user")
    .post(upload.none(), createUser) 
    .get(jwtConfig.verifyAdmin,upload.none(),fetchAllUsers)
  router.route("/login")
    .post(upload.none(), loginUser)  
    .get(jwtConfig.autoLogin)  
export default router;
