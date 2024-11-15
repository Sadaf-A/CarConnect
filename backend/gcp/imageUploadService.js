const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: './gcp/google-key.json', 
});

const bucketName = 'car-connect';

const uploadFile = async (filePath, destFileName) => {
  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: destFileName, 
    });
    console.log(`${filePath} uploaded to ${bucketName}`);
  } catch (err) {
    console.error('Error uploading file:', err);
  }
};

module.exports = { uploadFile };
