import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { APP_CONFIG } from '../config';

const s3client = new S3Client({
    region: APP_CONFIG.AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
    },
});

async function resizeImage(blob, ftype, rsize) {
  const imageBitmap = await createImageBitmap(blob);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Get original dimensions
  const originalWidth = imageBitmap.width;
  const originalHeight = imageBitmap.height;

  // Set desired dimensions
  const maxWidth = rsize?.width || 500;
  const maxHeight = rsize?.height || 500;

  // Calculate new dimensions while maintaining aspect ratio
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);
      width = width * ratio;
      height = height * ratio;
  }

  // Set canvas dimensions to new size
  canvas.width = width;
  canvas.height = height;

  // Draw the image onto the canvas
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  // Get the resized image data from the canvas
  const resizedBlob = await new Promise(resolve => canvas.toBlob(resolve, ftype));
  return resizedBlob.arrayBuffer();
}

async function uploadFileS3({fobj, setHttpLoading, ftype, rsize}) {
  console.log("In FileUpload uploadFile  -  " + JSON.stringify(fobj))
  try {
      const fname = fobj.name;
      const fileExtension = fname.split('.').pop();
      const hash = await calculateSHA256(fobj);
      const ufname = hash + '.' + fileExtension;
      let buffer;

      if (ftype === 'image/jpeg' || ftype === 'image/png' || ftype === 'image/jpg') {
          const arrayBuffer = await fobj.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: ftype });
          buffer = await resizeImage(blob, ftype, rsize);
      }

      const params = {
          Bucket: APP_CONFIG.AWS_BUCKET_NAME,
          Key: APP_CONFIG.AWS_UPLOAD_FOLDER + ufname,
          Body: (ftype === 'image/jpeg' || ftype === 'image/png' || ftype === 'image/jpg') ? buffer : fobj,
          ContentType: ftype,
      };
      const url = 'https://' + APP_CONFIG.AWS_BUCKET_NAME + '.s3.amazonaws.com/' + APP_CONFIG.AWS_UPLOAD_FOLDER + ufname;
      console.log("In FileUpload uploadFile  -  " + JSON.stringify([url, ufname]));
      setHttpLoading(true);
      const r = await s3client.send(new PutObjectCommand(params));
      setHttpLoading(false);
      console.log("In FileUpload uploadFile  response -  " + JSON.stringify(r));
      if (r['$metadata'] && r['$metadata']['httpStatusCode'] === 200)
          return {'status':'success', 'data': {'fname': fname, 'url': url, 'size': fobj.size, 'hash': hash, 'ftype': ftype, 'ufname': ufname}};
      return {'status': 'error'};
  } catch (e) {
      console.error('uploadFileS3 ', e);
      setHttpLoading(false);
  }
}

async function deleteFileS3(fname, setHttpLoading) {
    try {
      const deleteParams = {
        Bucket: APP_CONFIG.AWS_BUCKET_NAME,
        Key: APP_CONFIG.AWS_UPLOAD_FOLDER + fname,
      };
      setHttpLoading(true);
      const command = new DeleteObjectCommand(deleteParams);
      const response = await s3client.send(command);
      setHttpLoading(false);
      console.log("File deleted successfully", response);
    } catch (error) {
      console.error("Error deleting file:", error);
      setHttpLoading(false);
    }
}

async function calculateSHA256(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Convert bytes to hex string
    console.log("In FileUpload calculateSHA256  -  " + hashHex);
    return hashHex;
}

export { uploadFileS3, deleteFileS3 };