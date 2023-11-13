import { dynamoDBDescribeTable, dynamoDBScanTable, dynamodbUpdateTweet, getAllScanResults, sqsMessage } from "./aws"
import * as dotenv from 'dotenv'
import { Vendor } from "./types/vendor"
dotenv.config()

const init = async () => {
    const tableName = process.env.AWS_VENDORS_TABLE_NAME
    // await dynamoDBDescribeTable(tableName)
    // const scanIterator = await dynamoDBScanTable(tableName, 5)
    // console.log((await scanIterator.next()).value)
    // console.log((await scanIterator.next()).value)
    // const vendors = await getAllScanResults(tableName ?? '', 5)
    // console.log("vendors", vendors)
    // await dynamodbUpdateTweet(tableName ?? '', {
    //     id: 'tweet1',
    //     userId: 'DCTacoTruck',
    //     userName: 'DC Taco Truck',
    //     text: 'Test tweet',
    //     date: '02/07/23',
    //     geo: {
    //         id: 'geo1',
    //         name: "Geo location 1",
    //         place_type: 'place 1',
    //         full_name: 'place 1',
    //         country: 'USA',
    //         country_code: 'USA',
    //         coordinates: {
    //             lat: 34.01283,
    //             long: 41.1818
    //         }
    //     }
    // }, 'DCTacoTruck')
    await sqsMessage('https://sqs.us-east-1.amazonaws.com/148123604300/testqueue1', 'test message')
}

init()