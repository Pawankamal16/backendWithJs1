//jb url pr hit krte h

import { Router } from "express";
import {loginUser, logoutUser, registerUser,refreshAccesstoken}  from "../controllers/user.controller.js"

//file handling through multer
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


//registerUser se phle middleware inject kr rhe h
router.route("/register").post(
    upload.fields([
        {
          name: "avatar",
          maxCount:2
        },
        {
          name: "coverImage",
          maxCount: 1
        }
    ]),

    registerUser)


  router.route("/login").post(loginUser)
  
  //secured routes
   router.route("/logout").post(verifyJWT,logoutUser)
  
   router.route("/refresh-token").post(refreshAccesstoken)

   export default router

