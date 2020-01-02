

# CAPSTONE PROJECT - CLOUD DEVELOPER NANODEGREE
## TICKET MANAGER

Ticket Manager is a cloud application that allows an user to register/login to create his own Services tracker System. the user is allow to create a ticket, update the ticket status, Add comments to a ticket, add a file to a ticket and get all available tickets.

        
## AUTHENTICATION

Client front-end is not available in the moment, to register and login, OAUTH 2.0 settings are provided in the postman_collection.json file. just click on 'GET NEW ACCESS TOKEN' button in the AUTHORIZATION tab, then click on Request Token to register and login with your own user/password, copy the full  id_token and past it in the Access Token space. 

## CREATE A TICKET - POST

To create a ticket you must provide JSON Body, PATH: /ticket

    {
       "CustomerName":"string- Name of the customer",
       "Title":"string- Title to describe Ticket",	
       "Description":"string - Short description of why the ticket is created"
    } 

the application will complete the rest of the ticket body:
 
     {
        "userID": "google-oauth2|103538163944583965600",   (ID is created for each user)
        "ticket": "1",					   (a Ticket ID is created by an Atomic Counter in order to get a consecutive number)
        "createdAt": "2020-01-02T04:57:39.432Z",	   (ticket creation date)
        "dueDate": "2020-01-07T04:57:39.432Z",             (due Date set 5 days by defaul)
        "TicketStatus": "Open",				   (ticket Status can be change while the service is delivery)
        "Comments": [],					   ( user can add comments to the ticket, in order to keep track of ticket process while resoultion)
        "CustomerName": "Juan Delgado",
        "Title": "DVR DOWN 2",
        "Description": "All cameras are down"
      }

## TICKET STATUS UPDATE - PATCH

To update the ticket status, a query parameter is expected. PATH: /ticket/state/{ticketNumber}?state=

## ADD A COMMENT - POST

A json body style must  be provide. PATH: /ticket/{ticketNumber}/comment

  {
   "Comments":" Comments String"
  }

## CREATE A SAFE URL TO UPLOAD A FILE - POST

no body or parameter is required. PATH/ticket/{ticketNumber}/attachment

To test, after recieved the signer URL, please use in POSTMAN and create a PUT event with it. Make sure to set up the Content-Type value in Headers according to the type of file that is being uploaded. 

## GET A LIST OF ALL TICKETS AVAILABLE - GET

NO Body or parameters are requiered, user just need to be logged in and authenticated to obtain a list of his tickets. PATH: /tickets
 
## Service Information

### service: TicketManager

 - stage: dev
 - region: ca-central-1
 - stack: TicketManager-dev
 - resources: 52
 - api keys: None
 
 ### endpoints:
  - `POST - https://8s7maefyea.execute-api.ca-central-1.amazonaws.com/dev/ticket/{ticket}/attachment`
  - `GET - https://8s7maefyea.execute-api.ca-central-1.amazonaws.com/dev/ticket`
  - `PATCH - https://8s7maefyea.execute-api.ca-central-1.amazonaws.com/dev/ticket/state/{ticket}`
  - `POST - https://8s7maefyea.execute-api.ca-central-1.amazonaws.com/dev/ticket`
  - `POST - https://8s7maefyea.execute-api.ca-central-1.amazonaws.com/dev/ticket/{ticket}/comment`

### functions:
  - Auth: TicketManager-dev-Auth
  - AddUploadUrl: TicketManager-dev-AddUploadUrl
  - Gettickets: TicketManager-dev-Gettickets
  - UpdateStatus: TicketManager-dev-UpdateStatus
  - CreateTicket: TicketManager-dev-CreateTicket
  - AddComment: TicketManager-dev-AddComment















