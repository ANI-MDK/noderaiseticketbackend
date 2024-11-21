const multer    = require("multer")
const config    = require("./config")
const path      = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_FILES_DIR)
    },

    filename: (req, file, cb) => {
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

const uploadFiles = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
            cb(null, true);
        }
        else{
            cb(null, false);
            return cb('Only .png, .jpg and .jpeg format allowed!');
        }
    }
})

module.exports = uploadFiles