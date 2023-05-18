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
	STORAGE_DYNAMO7DBF1653_ARN
	STORAGE_DYNAMO7DBF1653_NAME
	STORAGE_DYNAMO7DBF1653_STREAMARN
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
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = process.env.STORAGE_DYNAMO7DBF1653_NAME

function id() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/****************************
* Example post method *
****************************/

app.post('/contact', function (req, res) {
  const item = {
    id: id(),
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  };
  const params = {
    TableName: table,
    Item: item
  };

  dynamodb.put(params, function (err, data) {
    if (err) {
      res.json({ err });
    } else {
      res.json({ success: "Successfully Created" });
    }
  });
});

/****************************
* Example get method *
****************************/

app.get('/contact', function(req, res) {
  const params = {
    TableName: table
  };

  dynamodb.scan(params, function(err, data) {
    if (err) {
      res.status(500).json({ message: 'Failed to retrieve contacts' });
    } else {
      res.json(data.Items);
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
