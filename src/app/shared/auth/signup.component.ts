declare const Buffer;

import { Component } from '@angular/core'; 
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  image:string;
  constructor() {}

 
  fileEvent(fileInput: any) {
    debugger;
    const AWSService = AWS;
    const region = 'us-east-2';
    const bucketName = 'peerpharmfront-20180920005744-deployment';
    const IdentityPoolId = 'us-east-2:bd006557-e0d1-4128-9170-6977e99a7516';
    const file = fileInput.target.files[0];
  //Configures the AWS service and initial authorization
    AWSService.config.update({
      region: region,
      credentials: new AWSService.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
  //adds the S3 service, make sure the api version and bucket are correct
  /*  const s3 = new AWSService.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: bucketName}
    });*/
  //I store this in a variable for retrieval later
    this.image = file.name;

    const bucket = new S3(
      {
        accessKeyId: 'AKIAJ7NEUXCVRNOWPH7A',
        secretAccessKey: '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',
        region: 'us-east-2'
      }
    );
     
    const params = {
      Bucket: bucketName,
      Key: 'uploads/' + file.name,
      Body: file
    };
     
    bucket.upload(params, function (err, data) {
      debugger;
    });

/*
    s3.upload({ Key: file.name, Bucket: bucketName, Body: file, ACL: 'public-read'}, function (err, data) {
     if (err) {
       console.log(err, 'there was an error uploading your file');
     }
   });*/

   
  }
 
}
