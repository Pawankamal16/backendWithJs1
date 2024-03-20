import { app } from "./app.js"
// require('dotenv').config({path : './env' }


import dotenv from "dotenv"
dotenv.config({
    path : './env'
})

import connectDB from "./db/index.js"

//execute func from db folder

 
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})







// import express from "express"
// const app = express()

// ( async() => {
//   try{
//     await mongoose.connect(`{process.env.MONGODB_URI}`)
//     // jaise hi db se connect hota h,next line m listener hote h, jo ki event ko handle krta h
//     // error event - dbs to connect ho gya but express ka app vo baat nhi kr pa rha,to error return krega
//     app.on("error ", (error) => {
//         console.log("ERROR: ",error);
//         throw error
//     })

//     app.listen(process.env.PORT, () => {
//        console.log(` App is listening on port${process.env.PORT}`)
//     })

//   }catch(error){
//     console.log("ERROR",error)
//     throw err
//   }
// })