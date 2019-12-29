import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ServiceItem } from "../models/service";
import { commentRequest } from "../requests/commentRequest";

// const AWSXRay = require('aws-xray-sdk-core');
// const AWS = AWSXRay.captureAWS(require('aws-sdk'));
// const XAWS = AWSXRay.captureAWS(AWS);
const XAWS = AWSXRay.captureAWS(AWS);


export class Service
{ constructor (
    private docClient: DocumentClient = createDynamoDBClient(),
    private S3 = createS3Bucket(),
    private serviceTable = process.env.SERVICE_TABLE,
    private bucket = process.env.BUCKET,
    private urlExp = process.env.EXPIRES
    //private index = process.env.SUB_INDEX
){}

async createService(service: ServiceItem ) : Promise<ServiceItem>{
    await this.docClient.put({
        TableName: this.serviceTable,
        Item: service
    }).promise();
    return service
    }
    
 async addComment(userID: string, ServiceID: string , comment: commentRequest){
    
    const commenttoadd =await this.docClient.update({
            TableName: this.serviceTable,
            Key: { userID, ServiceID},
            UpdateExpression: 'set Comments = list_append(Comments, :newComment)',
            ExpressionAttributeValues:{
                ':newComment':[comment],
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
        return commenttoadd;
    }
 
 async signedUrl(userID: string, ServiceID: string): Promise<string>{
    const uploadUrl = this.S3.getSignedUrl("PutObject", {
        Bucket: this.bucket,
        Key: ServiceID,
        Expires: this.urlExp 
    });
    await this.docClient.update({
        TableName: this.serviceTable,
        Key: {userID, ServiceID},
        UpdateExpression: "set attachmentUrl=:URL",
        ExpressionAttributeValues: {
            ":URL": uploadUrl.split("?")[0]
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();
    return uploadUrl;

 }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000"
    });
  }
  return new XAWS.DynamoDB.DocumentClient();
}

function createS3Bucket(){
    return new XAWS.S3({
        signatureVersion: "v4"
    });
}
