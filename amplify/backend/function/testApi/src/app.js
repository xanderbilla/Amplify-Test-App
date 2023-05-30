/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_TESTDB_ARN
	STORAGE_TESTDB_NAME
	STORAGE_TESTDB_STREAMARN
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const table = process.env.STORAGE_TESTDB_NAME

const itemId = () => {
  const currentDate = new Date();
  const datePart = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = currentDate.toTimeString().slice(0, 8).replace(/:/g, '');
  const countPart = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

  return `${datePart}${timePart}${countPart}`;
}

/**********************
 * Retrieve All Items *
 **********************/

app.get('/items', function(req, res) {
  const params = {
    TableName: table
  };

  docClient.scan(params, function(err, data) {
    if (err) {
      console.error('Error retrieving items from DynamoDB', err);
      res.status(500).json({ error: 'Failed to retrieve items from DynamoDB' });
    } else {
      res.json(data.Items);
    }
  });
});

/****************************
* Example post method *
****************************/

app.post('/items', function(req, res) {
  const { name, email, phone, married } = req.body;
  const id = itemId();

  const item = {
    id,
    name,
    email,
    phone,
    married: married ? true : false
  };

  const params = {
    TableName: table,
    Item: item
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error('Error saving item to DynamoDB:', err);
      res.status(500).json({ error: 'Failed to save item to DynamoDB' });
    } else {
      res.json({ success: 'Post call succeeded!', url: req.url, body: item });
    }
  });
});


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
