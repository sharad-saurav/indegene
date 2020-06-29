var express = require('express');
var router = express.Router();
const commonService = require('../service/commonService');
const MongoClient = require('mongodb').MongoClient;
 

// TASK 3
router.get('/profit', function(req, res) {
  commonService.getProfit().then(data =>{
    res.status(200).send(data);
  }).catch(err =>{
    res.status(400).send(err);
  })
})

// TASK 4
router.get('/birthDayWithPrice', function(req, res) {
  let totalPrice = parseFloat(req.query.totalPrice);
  let birthDate = req.query.birthDate;
  commonService.getBirthDay(totalPrice, birthDate).then(data =>{
    res.status(200).send(data);
  }).catch(err =>{
    res.status(400).send(err);
  })
})

module.exports = router;


