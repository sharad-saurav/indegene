var express = require('express');
var router = express.Router();
const commonService = require('../service/commonService');
const MongoClient = require('mongodb').MongoClient;


// TASK 1
router.get('/numberOfawards', function(req, res){
    var numberOfAwards = req.query.n;
    commonService.getNumberOfawards(numberOfAwards).then(data =>{
        res.status(200).send(data);
    }).catch(err =>{
        res.status(400).send(err);
    })
})

// TASK 2
router.get('/yearsOfAward', function(req, res) {
    var yearOfAwards = parseFloat(req.query.y);
    commonService.getAwardYear(yearOfAwards).then(data =>{
        res.status(200).send(data);
    }).catch(err =>{
        res.status(400).send(err);
    })
})

module.exports = router;