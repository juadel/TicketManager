import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TicketItem } from "../models/ticket";
import { commentRequest } from "../requests/commentRequest";

// const AWSXRay = require('aws-xray-sdk-core');
// const AWS = AWSXRay.captureAWS(require('aws-sdk'));
// const XAWS = AWSXRay.captureAWS(AWS);
const XAWS = AWSXRay.captureAWS(AWS);


export class Ticket
{ constructor (
    private docClient: DocumentClient = createDynamoDBClient(),
    private S3 = createS3Bucket(),
    private table = process.env.SERVICE_TABLE,
    private bucket = process.env.BUCKET
){}

async createService(service: TicketItem ) : Promise<TicketItem>{
    await this.docClient.put({
        TableName: this.table,
        Item: service
    }).promise();
    return service
    }
    
 async addComment(userID: string, ticket: string , comment: commentRequest){
    
    const commenttoadd =await this.docClient.update({
            TableName: this.table,
            Key: { userID, ticket},
            UpdateExpression: 'set Comments = list_append(Comments, :newComment)',
            ExpressionAttributeValues:{
                ':newComment':[comment],
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
        return commenttoadd;
    }
 
 async signedUrl(userID:string , ticket: string): Promise<string>{
    var params = {Bucket: this.bucket, Key: this.ticket_exist};
    const uploadUrl= this.S3.getSignedUrl('putObject', params);
    
    await this.docClient.update({
        TableName: this.table,
        Key: {userID, ticket},
        UpdateExpression: "set attachmentUrl=:URL",
        ExpressionAttributeValues: {
            ":URL": uploadUrl.split("?")[0]
        },
        ReturnValues: "UPDATED_NEW"
    }).promise();
    return uploadUrl;

 }

 async ticket_exist(userID: string, ticket: string){
    var params= {
        TableName: this.table, 
        Key:
        {
            userID: userID, 
            ticket: ticket
        }
    }

    var exist: Boolean = false
    const result = await this.docClient.get(params).promise(); 
        
    if (result.Item !== undefined && result.Item !==null){
        exist = true
    } 
    return (exist)   
    }
      
}


export function createDynamoDBClient() {
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
