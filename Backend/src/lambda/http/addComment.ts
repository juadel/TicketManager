import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { addcomment, ticket_exist } from "../../businessLogic/services"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!ticket_exist(event)){
      return{
        statusCode: 404,
        headers:{
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
      body: JSON.stringify({msg:"No tickets found with provided ID"})
      };
    }
  
  
    const comment = await addcomment(event)
  
    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
      body: JSON.stringify({msg:"comment added successfully",
        comment
      })
    };
  };




