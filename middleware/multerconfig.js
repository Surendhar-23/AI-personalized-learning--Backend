const multer = require("multer");
const path = require("path");
// const fs = require("fs");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

// Local upload

// const UPLOADS_FOLDER = path.join(__dirname, "../uploads/");
// if (!fs.existsSync(UPLOADS_FOLDER)) {
//   fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOADS_FOLDER);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
//   },
// });
// const upload = multer({ storage });

//
// AWS S3

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueName =
        uuid() + Date.now().toString() + path.extname(file.originalname);
      cb(null, uniqueName); // Use timestamp for a unique filename
    },
  }),
});

module.exports = upload;
