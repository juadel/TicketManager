
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { counterItem } from "../models/counter";

//const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(AWS);




export class Counter
{ constructor(
    private docClient: DocumentClient = createDynamoDBClient(),
    private table = process.env.ATOMIC_TABLE,
    
   
){}

async createCounter(counter: counterItem): Promise<counterItem>{
    await this.docClient.put({
        TableName: this.table,
        Item: counter
    })
    .promise();
    return counter;

}

async updatecount(userID : string){
    const updatedCount = await this.docClient.update({
        TableName: this.table,
        Key: { userID },
        UpdateExpression: "ADD #ticket :val",
        ExpressionAttributeNames:{
            "#ticket":"ticket"
        },
        ExpressionAttributeValues:{
            ":val":1
        } ,
        ReturnValues: "UPDATED_NEW"
    }).promise();
    return  updatedCount;
    

}

async isActiveCounter(userID: string){
    var params= {
        TableName: this.table, 
        Key:
        {
            userID
        }
    }

    var exist: Boolean = false
    const result = await this.docClient.get(params).promise(); 
        
    if (result.Item !== undefined && result.Item !==null){
        exist = true
    } 
    return (exist)   
    };
      
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
