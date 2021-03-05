var express = require("express");
var router = express.Router();
var mongo = require("mongodb");

router.get("/", function(req,res,next) {
	console.log("GET REQUEST");
});	

router.post("/", function(req,res,next) {	
	const MongoClient = require('mongodb').MongoClient;
	const uri = "mongodb+srv://dbUser:randomDbUserPassword@testcluster.wkyap.mongodb.net/accounts?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	client.connect(err => {
		const collection = client.db("accounts").collection("accountsInformation");
		let personDocument = {
			"name": req.body.name,
			"lastName": req.body.lastName
		}

		const p = collection.insertOne(personDocument);
		
		collection.find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			res.status(200).json({'accountsInformation' : result});
		});	
	});	
	client.close();
});

module.exports = router;


