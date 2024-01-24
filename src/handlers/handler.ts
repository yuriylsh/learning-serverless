import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import {v4 as uuid} from 'uuid';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamodb = new DynamoDBClient({
  region: 'us-east-2'
});

export const hello = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        event,
        context
      },
      null,
      2
    ),
  };
};

export const createAuction = async(event: APIGatewayProxyEvent, context: Context
): Promise<APIGatewayProxyResult> => {
  try{
    const jsonBody = JSON.parse(event.body!);
    const {title} = jsonBody as {title: string};
    const now = new Date();
    const auction = {
      id: uuid(),
      title,
      status: 'OPEN',
      createdAt: now.toISOString()
    };
    await dynamodb.send(new PutItemCommand({
      TableName: 'AuctionsTable',
      Item: {
        id: {S: uuid()},
        title: {S: title},
        status: {S: 'OPEN'},
        cretedAt: {S: now.toISOString()}
      }
    }));
    return {
      statusCode: 201,
      body: JSON.stringify(auction),
    };
  }catch(e){
    console.log("Error:", e);
    throw e;
  }
}