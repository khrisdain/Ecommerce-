import multer from "multer";
import sharp from "sharp";
import { fileURLToPath } from "url"; 
import { dirname } from "path";
import * as path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

/*diskStorage is preferred here as it grants total control on storing
our file on disk( alternatively: MemoryStorage) */
const storage = multer.diskStorage({
    destination: function ( req, file, cb){
        /*cb hanldes uncommon(overlooked) callback scenarios  */
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb){
        const uniqueSuffix = Date.now() + "-"+ Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg")
    },
});

const multerFilter = (req, file, cb) => {
    /*startsWith: if sequence of search correlates with object in function when converted 
    to a string.
    mimeType: indicates the nature of a file/documente etc (multipurpose internet mail extention) */
    if(file.mimetype.startsWith("image")){
        cb(null, true)
    }
    else{
        cb(
            { 
                message:"Unsupported file format"
            },
            false
        );
    }
};

/*multer handles the multipart/form-data for the various file that are to be
uploaded (node.js middleware) */
export const uploadPhoto = multer({
 storage: storage,
 fileFilter: multerFilter,
 limits: { fieldSize: 2000000}
})


/*sharp is implemented in the async to help convert lage image sizes to more flexible sizes*/
export const productImgResize = async( req, res, next) => {
    if(!req.file) return next();
    await promise.all(
        req.file.map(async(file) => {
            await sharp(file.path)
                .resize(300,300)
                .toFormat("jpeg")
                .jpeg({ quality: 90})
                .toFile(`public/images/products/${file.filename}`)
            fs.unlinkSync(`public/images/products/${file.filename}`)
        })
    );
    next();
};


export const blogImgResize = async( req, res, next) => {
    if(!req.file) return next();
    await promise.all(
        req.file.map(async(file) => {
            await sharp(file.path)
                .resize(300,300)
                .toFormat("jpeg")
                .jpeg({ quality: 90})
                .toFile(`public/images/products/${file.filename}`)
            fs.unlinkSync(`public/images/products/${file.filename}`)
        })

    );
    next();
};

