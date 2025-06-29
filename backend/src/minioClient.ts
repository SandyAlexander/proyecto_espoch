const Minio = require('minio');
const dotenv = require('dotenv');

dotenv.config();

export const minioClient = new Minio.Client({
    endPoint: process.env.HOST_MINIO || 'localhost',
    port: process.env.MINIO_PORT || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
});
// (async () => {
//     const sourceFile = './src/test.txt'
//     const destinationObject = 'my-test-file.txt'
//     const bucket = 'test'
//     // Check if the bucket exists
//     // If it doesn't, create it
//     const exists = await minioClient.bucketExists(bucket)
//     if (exists) {
//         console.log('Bucket ' + bucket + ' exists.')
//     } else {
//         await minioClient.makeBucket(bucket, 'us-east-1')
//         console.log('Bucket ' + bucket + ' created in "us-east-1".')
//     }

//     // Set the object metadata
//     var metaData = {
//         'Content-Type': 'text/plain',
//         'X-Amz-Meta-Testing': 1234,
//         example: 5678,
//     }

//     // Upload the file with fPutObject
//     // If an object with the same name exists,
//     // it is updated with new data
//     await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData)
//     console.log('File ' + sourceFile + ' uploaded as object ' + destinationObject + ' in bucket ' + bucket)
// })();


