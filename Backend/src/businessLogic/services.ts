
import { APIGatewayProxyEvent } from "aws-lambda";
import { ServiceItem } from "../models/service";

import { ServiceRequest } from "../requests/serviceRequest";
import { commentRequest } from "../requests/commentRequest"
import { Service } from "../dataLogic/serviceLogic";
import { createCounter } from "../businessLogic/counter";
import { isActiveCounter } from "../businessLogic/counter"
import { increaseCounter} from "../businessLogic/counter"
import { getUserId } from "../lambda/getUserId";



const serviceItem= new Service();


export async function createService( event: APIGatewayProxyEvent ): Promise<ServiceItem> {
  const userId = getUserId(event); 
  if (!isActiveCounter(userId)){
        await createCounter(userId);
      }
  
  const count = JSON.stringify((await increaseCounter(userId)).Attributes.ticket);
  

  const serviceId =count;
  const comments = [];
  const newService: ServiceRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const createdService = await serviceItem.createService(
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
  const serviceID :string = event.pathParameters.serviceID;
  const userId = getUserId(event); 
  const newcomment : commentRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body; 
  const result= await serviceItem.addComment(userId, serviceID, newcomment);
  return result;
}

export async function addUploadUrl(event: APIGatewayProxyEvent ): Promise<string> {
  const Serviceid = event.pathParameters.serviceID;
  const userId = getUserId(event);
  const generatedUrl= await serviceItem.signedUrl(userId, Serviceid);
  return generatedUrl
  
}


