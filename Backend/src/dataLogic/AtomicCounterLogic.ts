
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { counterItem } from "../models/counter";
import { createDynamoDBClient} from "../dataLogic/serviceLogic";





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
