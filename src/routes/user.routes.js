//jb url pr hit krte h

import { Router } from "express";

import {
   loginUser,
   logoutUser, 
   registerUser,
   refreshAccesstoken, 
   changeCurrentPassword, 
   getCurrentUser,
    updateAccountDetail, 
    updateUserAvatar,
     updateUserCoverImage, 
     getUserChannelProfile, 
     getWatchHistory
    }  from "../controllers/user.controller.js"


//file handling through multer
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verify } from "jsonwebtoken";

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
  
   router.route("/change-password").post(verifyJWT,changeCurrentPassword)

   router.route("/current-user").get(verifyJWT,getCurrentUser)
   
   router.route("/update-account").patch(verifyJWT,updateAccountDetail)
   
   router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
   
   router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
   
   //from params
   router.route("/c/:username").get(verify,getUserChannelProfile)

   router.route("/history").get(verifyJWT,getWatchHistory)

   export default router

