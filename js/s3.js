const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET
})

const s3 = new AWS.S3();

// READ S3

const readS3 = async (state) => {
  console.log("S3: Read file");
  let params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${state}.json`
  };

  return await new Promise((resolve, reject) => {
     s3.getObject(params, (error, data) => {
      if (error) {
        if (error == 'NoSuchKey') {
          console.log('in branch NoSuchKey')
        } else {
          console.log(`S3: Read error:${error.stack}`);
          resolve({
            statusCode: 400,
            error: `S3: Read error:${error.stack}`
          });
        }
      } else {
        console.log(`S3: Read successful`);
        resolve({
          statusCode: 200,
          data: data
        });
      }
    });
  });
};

// WRITE S3

const writeS3 = async (input, state) => {
  console.log("S3: Write file");
  let dataBuff = Buffer.from(JSON.stringify(input, null, 4));

  let params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${state}.json`,
    Body: dataBuff
  };

  return await new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        console.log(`S3: Write error:${error.stack}`);
        resolve({
          statusCode: 400,
          error: `S3: Write error:${error.stack}`
        });
      } else {
        console.log(`S3: Write successful`);
        resolve({
          statusCode: 200,
          data: data
        });
      }
    });
  });
};

module.exports = {
  writeS3, readS3
}