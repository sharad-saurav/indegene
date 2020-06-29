'use strict'

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'myproject';



function getProfit(){
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            db.collection('books').aggregate(
            [
                { 
                    $project: { 
                        authorId: 1, sold:1, total: { $multiply: [ "$sold", "$price" ] } 
                    }
                },
                {
                    $group: {
                        "_id":"$authorId", 
                        "profit": {"$sum": "$total"},
                        "sold": {"$sum":"$sold"}
                    }
                }
            ]).toArray(function(err, docs){
                if(err){
                    reject(err)
                }else{
                    resolve(docs);
                }
            });
        })
    })
}

function getBirthDay(totalPrice, birthDate){
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            db.collection('books').aggregate([
            {
            $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "authorData"
                }
            },
            {
                $project:{
                "authorId": 1,
                "authorData": 1,
                "totalPrice": {"$sum": "$price"}
                }
            },
            { $unwind:{
                path: "$authorData"
                }
            },
            {
                $group:{
                "_id": "$authorId", "totalPrice": {"$sum": "$totalPrice"}, birthDate: { $first: "$authorData.birth" }
                }
            },
            {
                $match: {
                $and: [ 
                    {totalPrice: {$gte: totalPrice}}, 
                    {birthDate: {$gte: new Date(birthDate)}}
                ]
                }
            }
        ]).toArray(function(err, docs){
                if(err){
                    reject(err)
                }else{
                    resolve(docs);
                }
            });
        })
    })
}

function getAwardYear(yearOfAwards){
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            db.collection('authors').find({'awards.year': { $gte: yearOfAwards }}).toArray(function(err, docs){
                if(err){
                    reject(err)
                }else{
                    resolve(docs);
                }
            });
        })
    })
}

function getNumberOfawards(numberOfAwards){
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            const db = client.db(dbName);
            var query = {
                $and: [ { $nor: []} ,{awards: {$exists:true}}]
            }
            for(var i= 0; i< numberOfAwards; i++){
                query.$and[0].$nor.push({"awards": {$size: i}})
            }
            console.log('query', JSON.stringify(query))
            db.collection('authors').find(query).toArray(function(err, docs){
                if(err){
                    reject(err)
                }else{
                    resolve(docs);
                }
            });
        })
    })
}


var toExport = {
    getProfit,
    getBirthDay,
    getAwardYear,
    getNumberOfawards
};
module.exports = toExport;