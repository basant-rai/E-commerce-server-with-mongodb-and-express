const multer = require('multer')

const fs = require('fs')// file system - node js
const path = require('path') // path - node js

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let fileDestination = 'public/uploads/'
        if (!fs.existsSync(fileDestination)) {
            fs.mkdirSync(fileDestination, { recursive: true })
            cb(null, fileDestination)
        }
        else {
            cb(null, fileDestination)
        }
    },

    filename: (req, file, cb) => {
        // originalname = abc.jpg
        // extname = jpg
        // basename = abc

        // abc_date.jpg

        let ext = path.extname(file.originalname) //remove extension .jpg
        let name = path.basename(file.originalname, ext) 
        let filename = name + '_' + Date.now() + ext
        cb(null, filename)
    }

})

let imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|png|gif|jpeg|svg|JPG|PNG|GIF|JPEG|SVG|jfif)$/)) {
        return cb(new Error('You can upload image file only'), false)

    }
    else {
        cb(null, true)
    }
}

let upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2048000 //2MB
    }
})

module.exports = upload