import { S3Client } from "@aws-sdk/client-s3";
import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";

import { environment } from "../configs/constants";

const s3BucketName = environment.AWS.S3.BUCKET_NAME;
const s3AccessKey = environment.AWS.S3.ACCESS_KEY;
const s3SecretKey = environment.AWS.S3.ACCESS_SECRET;

if (!s3BucketName || !s3AccessKey || !s3SecretKey) {
  throw new Error(
    "AWS S3 bucket name, access key, and secret key must be provided"
  );
}

// Interface for extending the Request type with the file property
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Function to create and configure an S3 client
function createS3Client() {
  if (!s3BucketName || !s3AccessKey || !s3SecretKey) {
    throw new Error(
      "AWS S3 bucket name, access key, and secret key must be provided"
    );
  }

  // Initialize and return the S3 client with the specified credentials
  return new S3Client({
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
  private static mediaFileFilter(req: MulterRequest, file: any, cb: any) {
    // Define allowed file types for images and videos
    const allowedImageTypes = ["image/jpeg", "image/png"];
    const allowedVideoTypes = ["video/mp4", "video/quicktime"];

    // Check if the file type is allowed and call the callback accordingly
    if (
      allowedImageTypes.includes(file.mimetype) ||
      allowedVideoTypes.includes(file.mimetype)
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(
        new Error(
          "Invalid file type, only JPEG, PNG, MP4, and MOV are allowed!"
        ),
        false
      ); // Reject the file
    }
  }

  // Function to generate a unique file key for each upload
  private static generateFileKey(
    req: MulterRequest,
    file: Express.Multer.File,
    cb: (error: any, key: string) => void
  ) {
    const timestamp = Date.now(); // Get the current timestamp
    const fileExtension = file.originalname.split(".").pop(); // Extract file extension
    cb(null, `${timestamp}.${fileExtension}`); // Create a unique file name using the timestamp
  }

  // Method to configure multer for media file uploads
  static uploadMedia = multer({
    fileFilter: StorageService.mediaFileFilter, // Use the media file filter

    storage: multerS3({
      // acl: 'public-read',
      s3,
      bucket: s3BucketName!,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata(req, file, cb) {
        cb(null, { fieldName: file.fieldname, url: file.path });
      },
      key: StorageService.generateFileKey,
    }),
  });

  // Placeholder for future methods (e.g., uploadAudio, etc.)
}

export default StorageService;
