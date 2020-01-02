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
    private bucket = process.env.BUCKET,
    private index = process.env.SUB_INDEX
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
    var params = {Bucket: this.bucket, Key: ticket};
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

 async ticket_exist(userID: string, ticket: string): Promise<Boolean>{
    var params= {
        ExpressionAttributeValues: {':u': userID, ':t': ticket},
        TableName: this.table,
        KeyConditionExpression: 'ticket = :t and userID = :u', 
    };

    var exist: Boolean = false;
    const result = await this.docClient.query(params).promise(); 
      
     if (result.Count > 0){
         exist = true;
     } 
     return exist;
    }
 
 async updateStatus(userID: string, ticket: string, newStatus: string){
    const newSttus= await this.docClient.update({
         TableName: this.table,
         Key: {userID: userID, ticket:ticket},
         UpdateExpression: "set TicketStatus= :NEWSTATUS",
        ExpressionAttributeValues: {
            ":NEWSTATUS": newStatus,
        },
        ReturnValues: "UPDATED_NEW"

     }).promise();
     return newSttus;
 }   
 
 async getTickets(userID: string): Promise<TicketItem[]>{
    const result = await this.docClient.query({
        TableName: this.table,
        IndexName: this.index,
        KeyConditionExpression: "userID = :userId",
        ExpressionAttributeValues: {
          ":userID": userID
        }
    }).promise();
    const items = result.Items;
    return items as TicketItem[];
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
