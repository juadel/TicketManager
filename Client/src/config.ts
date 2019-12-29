// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'jn2ybwhj1c'
export const apiEndpoint = `https://${apiId}.execute-api.ca-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-qnv7ap1b.auth0.com',            // Auth0 domain
  clientId: 'w0kOQ5ZfZPh04TfeU0KxcRj2M8Vw7bLQ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
