import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//app.use()  tb us ekrte h jb koi middleware ya koi configuration setting krni pde
app.use(cors ({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit : "16kb" }))                         // express json file ko accept kr rha h
app.use(express.urlencoded({extended: true, limit: "16kb"}));    // url ki request accept kr rha, extended means- taking object inside objects
app.use(express.static("public"))                                // kisi bhi file ko store kr rhe kisi public folder m, anyone can access
app.use(cookieParser())

//routes import


import userRouter from './routes/user.routes.js'

//routes declaration
//we are using middleware for taking the routers

app.use("/api/v1/users", userRouter)  // giving acces to userRouter when click /users

export {app}