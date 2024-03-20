import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"      // cryptigraphically use for making token,secret- make unique token,is a bearer token means which have this token ,can have data
import bcrypt from "bcrypt"         //node js library with zero dependency, to hash passwords

const userSchema = new Schema ({
    username:{
        type:String,
        required: true,
        unique : true,
        lowercase: true,
        trim: true,
        index: true
    },

    email:{
        type:String,
        required: true,
        unique : true,
        lowercase: true,
        trim: true,
    
    },

    fullName:{
        type:String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type:String,
        required: true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref : "Video"
    },
    password:{
        type:String,
        required: [true,'Password is required']
    },

    refreshToken: {
        type : String
    }
},
{
    timestamps: true
}
)


// pre middleware function are executed one after another,when each middleware calls next 
// means when user call or write a controller for data saving, just before sve execute hook means we are changing the data-encrypt before saving
// fun - deleteOne,update,save,updateOne,remove
// middleware have a access of next, move to the next operation when current is done

userSchema.pre( "save", async function(next) {
    // when we are sending password field then should change password not when changing the user images
    if(!this.isModified("password"))  return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

//design custom method-validaty passwod check from user because data saved in encrypt format
// inject methos in userSchema

userSchema.methods.isPasswordCorrect =async function(password) {
  return await bcrypt.compare(password,this.password)
}


//generate access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        // what method we want to place,sign method generate token
    {
        _id :this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

    )
}

// generate refresh token
userSchema.methods.generateRefreshToken = function(){
   return jwt.sign({
        _id :this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

//access token generated same as refresh token but their expiry time is differenet. 
//access token are short live while refresh token are long lived
//kisi bhi feature ko jha authentication ki jrurat h,vha resources ko aceess token ke through access kr skte h, ex- everyone is not authenticate to upload file on server,only one which is login.we need both during login
//user validate through access token,refresh token database m bhi hote h aur user ke pass bhi,if login session time is 15 min then refersh token concept come, every time we dont need to fill password, through refresh token ek end point kr de, vha se jo mere pass refresh token h aur dataabse m jo refersh token h, age match kr gye to, hm mannually new access token mil jayega
//user logged in through access aur refresh token.verify through this
//user ko baar bar login na krna pde, iske liye refresh token ka use krte h
//when user logged in , access and refresh token generate hota h.access token are short lived.as 10 min,so that in this time user can continue their work, then expire,for this fronted (user)se req ke sath refresh token bhi dete h,since refresh token store in db, then backend se both refresh token match honge, if match then logout successfully.and thus access token become refresh.

export const User = mongoose.model("User",userSchema)