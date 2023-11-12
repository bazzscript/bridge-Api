"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const constants_1 = require("../configs/constants");
const s3BucketName = constants_1.environment.AWS.S3.BUCKET_NAME;
const s3AccessKey = constants_1.environment.AWS.S3.ACCESS_KEY;
const s3SecretKey = constants_1.environment.AWS.S3.ACCESS_SECRET;
if (!s3BucketName || !s3AccessKey || !s3SecretKey) {
    throw new Error("AWS S3 bucket name, access key, and secret key must be provided");
}
// Function to create and configure an S3 client
function createS3Client() {
    if (!s3BucketName || !s3AccessKey || !s3SecretKey) {
        throw new Error("AWS S3 bucket name, access key, and secret key must be provided");
    }
    // Initialize and return the S3 client with the specified credentials
    return new client_s3_1.S3Client({
        region: "eu-central-1",
        credentials: {
            secretAccessKey: s3SecretKey,
            accessKeyId: s3AccessKey,
        },
    });
}
const s3 = createS3Client();
class StorageService {
    // File filter function for media uploads (images and videos)
    static mediaFileFilter(req, file, cb) {
        // Define allowed file types for images and videos
        const allowedImageTypes = ["image/jpeg", "image/png"];
        const allowedVideoTypes = ["video/mp4", "video/quicktime"];
        // Check if the file type is allowed and call the callback accordingly
        if (allowedImageTypes.includes(file.mimetype) ||
            allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(new Error("Invalid file type, only JPEG, PNG, MP4, and MOV are allowed!"), false); // Reject the file
        }
    }
    // Function to generate a unique file key for each upload
    static generateFileKey(req, file, cb) {
        const timestamp = Date.now(); // Get the current timestamp
        const fileExtension = file.originalname.split(".").pop(); // Extract file extension
        cb(null, `${timestamp}.${fileExtension}`); // Create a unique file name using the timestamp
    }
}
// Method to configure multer for media file uploads
StorageService.uploadMedia = (0, multer_1.default)({
    fileFilter: StorageService.mediaFileFilter,
    storage: (0, multer_s3_1.default)({
        // acl: 'public-read',
        s3,
        bucket: s3BucketName,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata(req, file, cb) {
            cb(null, { fieldName: file.fieldname, url: file.path });
        },
        key: StorageService.generateFileKey,
    }),
});
exports.default = StorageService;
