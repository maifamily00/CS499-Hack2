var request = require('request');
var parseString = require('xml2js').parseString;
var AWS = require('aws-sdk');

AWS.config.update({
	region: "us-west-1"
});

'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Wait time has been updated!',
    }),
  };
  
  
  fetchWaitingtimes();
  callback(null, response);
};

 module.exports.queryWaitTime = (event, context, callback) => {  
  queryWaitingtime(event.pathParameters.name, callback);
};

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "CppShuttle";

function fetchWaitingtimes(){
	request('https://rqato4w151.execute-api.us-west-1.amazonaws.com/dev/info', function (error, response, body) {
		if(!error && response.statusCode == 200) {
			parseString(body, fucntion (err,result) {
				var items = result.rss.channel[0].item;
				for(var i = 0; i < items.length; i++) {
					console.log(items[i].title[0], items[i].description[0]);
					putItem(items[i].title[0], items[i].description[0]);
				}
			});
		}
	})
}

function putItem(busID) {
	var params = {
		TableName: table,
		Item:{
			"logo":
			"lat":
			"lng":
			"route":
		}
	};
	
	console.log("Adding a new item...");
		docClient.put(params, function(err, data) {
		    if (err) {
		        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
		    } else {
		        console.log("Added item:", JSON.stringify(data, null, 2));
		    }
		});
}

function queryWaitingtime(busID, res) {
	var params = {
		TableNAme : table,
		KeyConditionExpression: "#key = :inputName",
		ExpressionAttributeNames:{
			"#key": "busID"
		},
		ExpressionAttributeValues: {
			":inputName": busID
		}
	};
	docClient.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));      
      if (callback) {
        const responseErr = {
          statusCode: 500,
          body: JSON.stringify({'err' : err}),
        };
        callback(null, responseErr);  
      }
    } else {
      data.Items.forEach(function(item) {
        console.log(item);
      });
      
      if (callback) {
        const responseOk = {
          statusCode: 200,
          body: JSON.stringify(data.Items),
        };
        callback(null, responseOk);  
      }
    }
});
}
