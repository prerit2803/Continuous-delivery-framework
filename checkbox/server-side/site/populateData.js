var faker = require("faker");
faker.locale  = "en";
var _ = require('lodash');
var Promise = require('promise');
var randomstring = require("randomstring");
var Models = require("./models").models;
var studyKinds = ["dataStudy", "survey"];
var studyStatus = ["open", "pending", "closed"];
var IDCollection = [];

var study= Models.StudyModel;
var vote= Models.VoteModel;

let arr = populateData().then(function(coll){
  module.exports.data = coll;
  process.exit(0);
});


function populateData(){
  return new Promise(function(resolve, reject){
    _.times(5, function(){
      addStudy().then(function(status){
        resolve(IDCollection)
      }).catch(function(err){
        console.log(err);
      });
    });
  });
}

function addStudy(){
  return new Promise(function(resolve, reject){
    getData().then(function(status){
      resolve(status)
    });
  });
}
function getData(){
  return new Promise(function(resolve, reject){
    study.create({
    	"name" : faker.name.findName(),
    	"description" : faker.lorem.sentence(),
    	"studyKind" : studyKinds[_.random(0,1)],
    	"researcherName" : faker.name.findName(),
    	"contact" : faker.phone.phoneNumberFormat(3),
    	"status" : studyStatus[_.random(0, 2)],
    	"goal" : _.random(1, 100),
    	"invitecode" : "RESEARCH",
      "token": randomstring.generate()
    },function(error, doc) { //This saves the information you see within that Bee declaration (lines 4-6).
        if (error)
          reject(error);
        // console.log(error, doc)
        IDCollection.push({
          id: doc._id
        });
        resolve("saved");
    });
  });
}
