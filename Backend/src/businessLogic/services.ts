
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
  

  const serviceId =count;
  const comments = [];
  const newService: ServiceRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const createdService = await ticket.createService(
      { 
        userID: userId,
        ServiceID: serviceId,
        createdAt: new Date().toISOString(),
        Status: false,
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
