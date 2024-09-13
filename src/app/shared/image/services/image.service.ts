import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  fileUploadEstablishment(file, timestamp) {
    const contentType = file.type;
    const bucket = new S3(
    {
    accessKeyId: 'AKIASXSKUS5OM37CT76O',
    secretAccessKey: '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',
    region: 'us-east-2',
    }
    );
    const params = {
    Bucket: 'hamgus-establishments-assets',
    Key: file.name + timestamp,
    Body: file,
    ACL: 'public-read',
    ContentType: contentType
    };
    bucket.upload(params, function (err, data) {
    if (err) {
    console.log('EROOR: ',JSON.stringify( err));
    return false;
    }
    return true;
    });
    }

    fileUploadProducts(file, timestamp) {
      const contentType = file.type;
      const bucket = new S3(
      {
      accessKeyId: 'AKIASXSKUS5OM37CT76O',
      secretAccessKey: '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',
      region: 'us-east-2',
      }
      );
      const params = {
      Bucket: 'hamgus-products-assets',
      Key: file.name + timestamp,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
      };
      bucket.upload(params, function (err, data) {
      if (err) {
      console.log('EROOR: ',JSON.stringify( err));
      return false;
      }
      return true;
      });
      }
}
