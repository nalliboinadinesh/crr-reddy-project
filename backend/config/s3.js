const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const logger = require('./logger');

// Validate AWS credentials
const validateAWSCredentials = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-aws-access-key-id') {
    logger.warn('WARNING: AWS_ACCESS_KEY_ID not configured. File uploads will fail. Set AWS_ACCESS_KEY_ID environment variable.');
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY === 'your-aws-secret-access-key') {
    logger.warn('WARNING: AWS_SECRET_ACCESS_KEY not configured. File uploads will fail. Set AWS_SECRET_ACCESS_KEY environment variable.');
  }
  if (!process.env.AWS_BUCKET_NAME) {
    logger.warn('WARNING: AWS_BUCKET_NAME not configured. File uploads will fail.');
  }
};

// Call validation on startup
validateAWSCredentials();

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Upload file to S3
const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME not configured. Please set AWS_BUCKET_NAME environment variable.');
    }

    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-aws-access-key-id') {
      throw new Error('AWS_ACCESS_KEY_ID not configured. Please set valid AWS credentials.');
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY === 'your-aws-secret-access-key') {
      throw new Error('AWS_SECRET_ACCESS_KEY not configured. Please set valid AWS credentials.');
    }

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET_NAME,
        Key: `files/${Date.now()}-${fileName}`,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read'
      }
    });

    const result = await upload.done();
    const location = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${result.Key}`;
    logger.info(`File uploaded to S3: ${location}`);
    return location;
  } catch (error) {
    logger.error('Error uploading to S3:', error);
    throw error;
  }
};

// Upload image to S3
const uploadImageToS3 = async (file, keyPath) => {
  try {
    if (!BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME not configured. Please set AWS_BUCKET_NAME environment variable.');
    }

    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your-aws-access-key-id') {
      throw new Error('AWS_ACCESS_KEY_ID not configured. Please set valid AWS credentials.');
    }

    if (!process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY === 'your-aws-secret-access-key') {
      throw new Error('AWS_SECRET_ACCESS_KEY not configured. Please set valid AWS credentials.');
    }

    // Handle both multer file object and buffer
    const fileBuffer = file.buffer || file;
    const mimeType = file.mimetype || 'application/octet-stream';
    const fileName = file.originalname || 'upload';

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: BUCKET_NAME,
        Key: keyPath || `banners/${Date.now()}-${fileName}`,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read'
      }
    });

    const result = await upload.done();
    const location = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${result.Key}`;
    logger.info(`Image uploaded to S3: ${location}`);
    return location;
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

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });

    await s3.send(command);
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
