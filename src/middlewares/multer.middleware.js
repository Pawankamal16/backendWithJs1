import multer from "multer"
const storage = multer.diskStorage({

    // the folder to which the file has been saved
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})