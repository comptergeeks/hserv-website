import { NextResponse } from "next/server";
import { UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import docClient from "../../lib/dyanamodb.js";

export async function POST(request) {
  try {
    const { choice } = await request.json();

    // Update the vote count
    const command = new UpdateCommand({
      TableName: "PollResponses",
      Key: {
        id: "poll-stats", // Using a single item to store all stats
      },
      UpdateExpression: "ADD #choice :inc",
      ExpressionAttributeNames: {
        "#choice": choice,
      },
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);

    // Return the updated counts
    return NextResponse.json(response.Attributes);
  } catch (error) {
    console.error("Error processing vote:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const command = new GetCommand({
      TableName: "PollResponses",
      Key: {
        id: "poll-stats",
      },
    });

    const response = await docClient.send(command);
    return NextResponse.json(response.Item || { yes: 0, no: 0, unsure: 0 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 },
    );
  }
}
