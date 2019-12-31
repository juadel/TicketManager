
import { APIGatewayProxyEvent } from "aws-lambda";
import { TicketItem } from "../models/ticket";

import { ServiceRequest } from "../requests/serviceRequest";
import { commentRequest } from "../requests/commentRequest"
import { Ticket } from "../dataLogic/ticketsLogic";
import { createCounter } from "../businessLogic/counter";
import { isActiveCounter } from "../businessLogic/counter"
import { increaseCounter} from "../businessLogic/counter"
import { getUserId } from "../lambda/getUserId";



const ticket= new Ticket();


export async function createService( event: APIGatewayProxyEvent ): Promise<TicketItem> {
  const userId = getUserId(event); 
  if (!isActiveCounter(userId)){
        await createCounter(userId);
      }
  
  const count = JSON.stringify((await increaseCounter(userId)).Attributes.ticket);
  const today = new Date();
  const dueDate = new Date().setDate(today.getDate()+7);

  const ticketCount =count;
  const comments = [];
  const newService: ServiceRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const createdService = await ticket.createService(
      { 
        userID: userId,
        ticket: ticketCount,
        createdAt: today.toISOString(),
        dueDate: dueDate.toString(),
        State: "Open",
        Comments: comments,
        ...newService
      }
    );
  return createdService;
}

export async function addcomment(event: APIGatewayProxyEvent) {
  const ticketid :string = event.pathParameters.ticket;
  const userId = getUserId(event); 
  const newcomment : commentRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body; 
  const result= await ticket.addComment(userId, ticketid, newcomment);
  return result;
}

export async function addUploadUrl(event: APIGatewayProxyEvent ): Promise<string> {
  const ticketid = event.pathParameters.ticket;
  const userId = getUserId(event);
  const generatedUrl= await ticket.signedUrl(userId, ticketid);
  return generatedUrl
  
}

export async function ticket_exist(event: APIGatewayProxyEvent): Promise<Boolean> {
  const userId = getUserId(event);
  const ticketid = event.pathParameters.ticket;
  const exist = await ticket.ticket_exist(userId,ticketid);
  return exist;
}

export async function updateStatus(event: APIGatewayProxyEvent){
  if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
    if (event.queryStringParameters.state !== undefined &&
      event.queryStringParameters.state !== null &&
      event.queryStringParameters.state !== "") {
      console.log("Received proxy: " + event.queryStringParameters.state);
      var state = event.queryStringParameters.state;
      const userId = getUserId(event);
      const ticketId = event.pathParameters.ticket;
      const statusUpdated = await ticket.updateStatus(userId, ticketId, state)
      return statusUpdated;
      
    }
  }
    else{
      return JSON.stringify({msg:"The request could not be completed"})
    };
  }



// export async function getTickets(event: APIGatewayProxyEvent): Promise<TicketItem[]>{
//   const userId = getUserId(event);
//   const status = await ticket.getTickets(userId);
//   return status;
// }