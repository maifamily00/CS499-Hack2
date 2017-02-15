var request = require('request');
var parseString = require('xml2js').parseString;
var AWS = require('aws-sdk');

var express = require('express)
var app = express()

AWS.config.update({
	region: "us-west-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "cpp_bus_time"

function fetchWaitingtimes(){
	request('https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info', function (error, response, body)
	if (!error && response.statusCode == 200) {
			parseString(body,function(err,result)}