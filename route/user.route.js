import express  from "express";
import { user , verifyUser , login ,logout , getme , forgotpassword , resetpassword } from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register",user);
router.get("/verifiuser/:token",verifyUser);
router.post("/login" ,login );
router.get("/getme" , isLoggedIn , getme);
router.get("/logout" ,isLoggedIn , logout);
router.post("/forgotpassword" , forgotpassword);
router.post("/resetpassword/:token" , resetpassword);


export default router;
