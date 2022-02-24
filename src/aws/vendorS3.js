const S3 = require("aws-sdk/clients/s3");

const region = process.env.AWS_BUCKET_REGION;
const bucketName = process.env.AWS_VENDOR_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});
