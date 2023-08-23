const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const shortId = require('shortid');

let s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: 'AKIAV4WVRSRIZPK4OTXX',
    secretAccessKey: '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',
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bizfinn-uploads',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, shortId.generate() + '-' + file.originalname);
    },
  }),
});