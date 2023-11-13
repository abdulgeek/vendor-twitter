import AWS from "aws-sdk";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as dotenv from 'dotenv'
import { Tweet } from "./types/twitter";
dotenv.config()
AWS.config.update({ region: process.env.AWS_REGION });

const { DynamoDB, SQS } = AWS;
const dynamodb = new DynamoDB();
const sqs = new SQS();

// describe a table
export const dynamoDBDescribeTable = async (tableName: any) => {
    try {
        const data = await dynamodb.describeTable({ TableName: tableName }).promise()
        console.log("table retrived", data)
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
        throw new Error(`dynamoDBDescribeTable error object unknown type`);
    }
}


// scan table
export const dynamoDBScanTable = async function* (tableName: any, limit: number = 25, lastEvaluatedKey?: AWS.DynamoDB.Key) {
    while (true) {
        const params: AWS.DynamoDB.ScanInput = {
            "TableName": tableName,
            "Limit": limit
        }
        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = yield lastEvaluatedKey
        }

        try {
            const data = await dynamodb.scan(params).promise();
            if (!data.Count) {
                return;
            }
            lastEvaluatedKey = (data as AWS.DynamoDB.ScanOutput).LastEvaluatedKey;
            data.Items = data?.Items?.map((item) => unmarshall(item));
            yield data;
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error(`dynamoDBScanTable error object unknown type`);
        }
    }
}

// get all scan results from DynamoDB

export const getAllScanResults = async (tableName: string, limit: number = 25) => {
    try {
        await dynamoDBDescribeTable(tableName);
        const scanTableGen = dynamoDBScanTable(tableName, limit);
        const results: any[] = [];
        let isDone = false;
        while (!isDone) {
            const iterator = await scanTableGen.next();
            if (iterator.done) {
                isDone = true;
                break;
            }
            const items: any = iterator.value?.Items
            if (items) {
                results.push(...items);
            }
            if (!iterator.value?.LastEvaluatedKey) {
                isDone = true;
            }
        }
        return results;
    } catch (error) {
        console.error('Error in getAllScanResults:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`getAllScanResults unexpected error: ${error}`);
    }
}

// update tweet in dynamodb
export const dynamodbUpdateTweet = async (tableName: string, tweet: Tweet, twitterId: string) => {
    try {
        const params: AWS.DynamoDB.UpdateItemInput = {
            TableName: tableName,
            Key: marshall({
                twitterId: twitterId
            }),
            UpdateExpression: "set #tweets = list_append(if_not_exists(#tweets, :empty_list), :tweet), #updated = :updated",
            ExpressionAttributeNames: {
                '#tweets': 'tweets',
                '#updated': 'updated'
            },
            ExpressionAttributeValues: marshall({
                ':tweet': [tweet],
                ':updated': Date.now(),
                ':empty_list': []
            })
        }
        const data = await dynamodb.updateItem(params).promise();
        console.log("Tweed added to record");
        return data;
    } catch (error) {
        console.error('Error in dynamodbUpdateTweet:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`dynamodbUpdateTweet unexpected error: ${error}`);
    }
}

export const sqsMessage = async (queueUrl: string, body: string) => {
    try {
        const params: AWS.SQS.SendMessageRequest = {
            MessageBody: body,
            QueueUrl: queueUrl
        }
        const data = await sqs.sendMessage(params).promise();
        console.log("Sent message successfully");
        return data;
    } catch (error) {
        console.error('Error in sqsMessage:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`sqsMessage unexpected error: ${error}`);
    }
}