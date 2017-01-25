var express = require('express');
var mongodb = require('mongodb');
var shortid = require('shortid');
var validUrl = require('valid-url');

var app = express();

var dbUrl = "mongodb://localhost:27017/url-shortener-microservice";
var MongoClient = mongodb.MongoClient

var port = 8080;
app.listen(process.env.PORT || port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

app.get('/', function (req, res) {
	res.send('URL Shortener API!')
})

app.get('/new/:url(*)', function(req, res){
  // route to create and return a shortened URL given a long URL
  // res.send(req.params.url);
  MongoClient.connect(dbUrl, function (err, db) {
	  if (err) {
	    console.log("Unable to connect to server", err);
	  } else {
	    console.log("Connected to server")
	    // var collection = db.collection('links');
	    // var params = req.params.url;
	    // var newLink = function(db, callback) {
	    // 	newLink(db, function() {
	    // 		var insertLink = {url: params, short: "test" };
	    // 		collection.insert([insertLink]);
	    // 		res.send(params);
	    // 		db.close();
	    // 	});
	    // }
	  };
	});
});

app.get('/:short_url', function(req, res){
  // route to redirect the visitor to their original URL given the short URL
});
