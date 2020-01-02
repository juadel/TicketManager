import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateStatus,  ticket_exist} from "../../businessLogic/services"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const exist :Boolean = await ticket_exist(event)
    if (exist == true){  
      const newStatus = await updateStatus(event)
  
      return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
         },
        body: JSON.stringify({msg:"Status has been updated",
        newStatus
        })
     };
    }else{
      return{
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify("Ticket provided do not exist")
      } 
    };
}




