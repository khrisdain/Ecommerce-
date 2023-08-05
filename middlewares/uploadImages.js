import multer from "mmulter";
import sharp from "sharp";
import path from "path"

/*diskStorage is preferred here as it grants total control on storing
our file on disk( alternatively: MemoryStorage) */
const multerStorage = multer.diskStorage({
    destination: function ( req, file, cb){
        /*cb hanldes uncommon(overlooked) callback scenarios  */
        cb(null, path.join(__dirname, "../public/images"));
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
    if(file.mimeType.startsWith("image")){
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
 storage: multerStorage,
 fileFilter: multerFilter,
 limits: { fieldSize: 2000000}
})

export const productImgResize = async( req, res, next ) => {
    if(!req.files) return next();
    await Promise.all(
        req.file.map(async(file) => {
            await sharp(file.path)
                .resize(300,300)
                .toFormat("jpeg")
                .jpeg({ quality: 90})
                .toFile(`public/images/producets/${file.filename}`)
        })
    );
    next();
};