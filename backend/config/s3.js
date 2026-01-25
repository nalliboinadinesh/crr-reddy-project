const AWS = require('aws-sdk');
const logger = require('./logger');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Upload file to S3
const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME not configured');
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: `files/${Date.now()}-${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read' // Make files publicly readable
    };

    const result = await s3.upload(params).promise();
    logger.info(`File uploaded to S3: ${result.Location}`);
    return result.Location;
  } catch (error) {
    logger.error('Error uploading to S3:', error);
    throw error;
  }
};

// Upload image to S3
const uploadImageToS3 = async (file, keyPath) => {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME not configured');
    }

    // Handle both multer file object and buffer
    const fileBuffer = file.buffer || file;
    const mimeType = file.mimetype || 'application/octet-stream';
    const fileName = file.originalname || 'upload';

    const params = {
      Bucket: BUCKET_NAME,
      Key: keyPath || `banners/${Date.now()}-${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    logger.info(`Image uploaded to S3: ${result.Location}`);
    return result.Location;
  } catch (error) {
    logger.error('Error uploading image to S3:', error);
    throw error;
  }
};

// Delete file from S3
const deleteFileFromS3 = async (fileUrl) => {
  try {
    if (!BUCKET_NAME || !fileUrl) {
      return;
    }

    // Extract key from S3 URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(-2).join('/');

    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();
    logger.info(`File deleted from S3: ${fileUrl}`);
  } catch (error) {
    logger.error('Error deleting from S3:', error);
    // Don't throw - continue even if deletion fails
  }
};

module.exports = {
  uploadFileToS3,
  uploadImageToS3,
  deleteFileFromS3,
  s3,
  BUCKET_NAME
};
