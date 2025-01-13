const multer    = require("multer")
const config    = require("../../../config/config")
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
        fileSize: parseInt(config.MAX_FILE_SIZE)
    },
    fileFilter: (req, file, cb) => {
        const allowedMimetypes = [
            "image/jpg", "image/jpeg", "image/png",
            "application/pdf"
        ]
        if(allowedMimetypes.includes(file.mimetype)) {
            cb(null, true)
        }
        else{
            cb(null, false)
            return cb(new Error("Invalid file type. Only JPG, JPEG, PNG and PDF are allowed"))
        }
    }
})

module.exports = uploadFiles