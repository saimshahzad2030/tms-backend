
import { Router } from "express";
import {  createUser, fetchAllUsers, loginUser } from '../controllers/user.controller';
// import { changePasswordOnForget, createUser, sendOtp, getUsers, loginUser, verifyOtp, changePassword, changeInfo, deleteUser } from '../controllers/user.controller';
import jwtConfig from "../middleware/jwt";
 

const router = Router()
 
router.route("/user")
    .post( createUser) 
    .get(jwtConfig.verifyAdmin,fetchAllUsers)
  router.route("/login")
    .post( loginUser)  
    .get(jwtConfig.autoLogin)  
export default router;
