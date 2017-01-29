var express = require('express');
var mongodb = require('mongodb');
var shortid = require('shortid');
var validUrl = require('valid-url');

var app = express();

// var dbUrl = "mongodb://localhost:27017/url-shortener-microservice";
var dbUrl = process.env.MONGOLAB_URI;

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
	    console.log("Connected to server");
	    var collection = db.collection('links');
	    var params = req.params.url;
	    var local = "http://" + req.get('host'); + "/";
	    var newLink = function(db, callback) {
	    	if (validUrl.isUri(params)) {
	   		// do stuff
	   		var shortCode = shortid.generate();
	   		var newUrl = { url: params, short: shortCode };
	   		collection.insert([newUrl]);
	   		res.json({
	   			original_url: params,
	   			short_url: local + shortCode
	   		});
	   	} else {
	   		// do other stuff
	   		res.json({
	   			error: "Wrong URL format. Make sure it's a real site and has valid http/https protocol!"
	   		});
	   	}
	  //   	var insertLink = { url: params, short: "test" };
			// collection.insert([insertLink]);
			// res.send(params);
	   };
	   newLink(db, function() {

	   	db.close();
	   });
	  };
	});
});

app.get('/:short', function(req, res, next){
  // route to redirect the visitor to their original URL given the short URL
  MongoClient.connect(dbUrl, function (err, db) {
	  if (err) {
	    console.log("Unable to connect to server", err);
	  } else {
	    console.log("Connected to server");
	    var collection = db.collection('links');
	    var params = req.params.short;

			var findLink = function(db, callback) {
			     	
			  collection.findOne({ "short": params }, { url: 1, _id: 0 }, function (err, doc) {
		  if (doc != null) {
		    res.redirect(doc.url);
		  } else {
		    res.json({ error: "No matching shortlink found in the database." });
		  };
		});
	    	
	   };
	   findLink(db, function() {
	   	
	   	
	   	db.close();
	   	});

		}
	});
});
