import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Jwt } from "jsonwebtoken";
import { SchemaTypeOptions } from "mongoose";

// not using asynchandler because we are not handling any web request, this is our internal method
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //save refresh token in database
        user.refreshToken =refreshToken
        await user.save({ validateBeforeSave: false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refersh and access token")
    }
}

const registerUser = asyncHandler( async(req,res)=>{
    // res.status(200).json({
    //     message : "ok bro"
    // })

    //get user details from frontend
    //validation - not empty
    //check if user already exits: username,email
    //check for images,check for avatar
    // upload them to cloudinary
    //create user object-create entry in db
    //remove password and refresh token field from response
    // check for user creation
    //return res

    //get user details,req.body- from express
     const {fullName,email,username,password} =req.body
     console.log("email: ", email);

    //  if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    //  }
    
    //if return true means is empty field
    if (
      [fullName,email,username,password].some((field)=>
      field?.trim() === "")
    ) {
       throw new ApiError(400, "fullname is required")
    }


 // findOne- first entry/document jo mil jayega mongodb m, return kr deta h
 //check user based on username or email
 const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, " User with email or username is already exists")
    }

 // req.files- from multer, multer image ko lega aur apne server pr rkhega
 //this is in our server not in cloudinary,check for images upload
  const avatarLocalPath = req.files?.avatar[0]?.path
  //const coverImageLocalPath = req.files?.coverImage[0]?.path

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage)
  && req.files.coverImage.length >0){
  coverImageLocalPath = req.files.coverImage[0].path
}

  //CHECK FOR AVATAR
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(400,"Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    //remove which we want
    "-password -refreshToken"
  )

  //check for user creation
  if(!createdUser){
    throw new ApiError(500, "something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User register successfully")
  )

  
 })

const loginUser = asyncHandler( async(req,res)=>{
   // req body -> data
    // username or email
    //find the user
    //password check
    //if password is correct - generate access and referesh token
    //send token as a secure cookie and response

    const {email,username,password} = req.body

    if(!username && !email){
        throw new ApiError(400, "username or email is required")
    }
 
    //db dusre continent m h to await use kr rhe h
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid= await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Inavlid user credentials")
    }
 //destructure
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //seding cookies, for this we create options of cookie-which take an object
    //when set httpOnly and secure is true means cookie is modifiable only through server othervise anyone from frontend

    const options= {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged In successfully"
        )
    )


}) 

const logoutUser = asyncHandler(async (req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        //what we have to update
        $set:{
            refreshToken: undefined
        }
    },
    {
        new : true   //return new updated value
    }
   )


   const options ={
    httpOnly : true,
    secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged out"))
})

//
const refreshAccesstoken = asyncHandler(async(req,res)=>{
    //access refresh token from cookies || from mobile app
    //user sending request token
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        return new ApiError(401,"Unauthorized request")
    }

    try {
        // decoded refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
     
        //decode krke user find kr rha
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
    
        // generate new token
        const options = {
            httpOnly:true,
            secure: true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
        
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,refreshToken: newRefreshToken
                },
                "Access Token refreshed"
            )
        )

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }

})


 

export {registerUser,loginUser,logoutUser,refreshAccesstoken}
