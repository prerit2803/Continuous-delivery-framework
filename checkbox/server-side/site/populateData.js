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
// study.remove(function(err){
//   if(err) console.log(err);
// });
let arr = populateData().then(function(coll){
  // console.log("adsdasd",coll);
  module.exports.data = coll;
  process.exit(0);
});


function populateData(){
  return new Promise(function(resolve, reject){
    _.times(5, function(){
      // console.log("CALLING ADD STUDY")
      addStudy().then(function(status){
        // console.log(status);
        // study.find(function (err, kittens) {
        //   if (err) return console.error(err);
        //   console.log(kittens);
        // });
        // console.log(IDCollection);
        resolve(IDCollection)
      }).catch(function(err){
        console.log(err);
      });
    });
  });
}

function addStudy(){
  // console.log("In ADD STUDY")
  return new Promise(function(resolve, reject){
    getData().then(function(status){
      // console.log("asdasd")
      resolve(status)
    });
  });
}
function getData(){
  // console.log("In GET STUDY")
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


// _.times(1, function(){
//   console.log("CALLING ADD Vote")
//   addVote().then(function(status){
//     console.log(status);
//     // study.find(function (err, kittens) {
//     //   if (err) return console.error(err);
//     //   console.log(kittens);
//     // });
//   }).catch(function(err){
//     console.log(err);
//   });
// });
//
// function addVote(){
//   console.log("In ADD vote")
//   return new Promise(function(resolve, reject){
//     getVote().then(function(status){
//       resolve(status)
//     });
//   });
// }
// function getVote(){
//   console.log("In GET vote")
//   return new Promise(function(resolve, reject){
//     vote.create({
//       "studyId": mongoose.Types.ObjectId("5aaedee73742321912a4f482"),
//       "fingerprint": "fingerprint-here",
//       "answers":  {"ques1": "ans1", "ques2": "ans2"} ,
//       "email": "user@ust.com",
//       "contact": "1234567890"
//     },function(error, doc) { //This saves the information you see within that Bee declaration (lines 4-6).
//         if (error)
//           reject(error);
//         console.log(doc)
//         vote.find(function (err, kittens) {
//           if (err) return console.error(err);
//           console.log(kittens);
//         });
//         resolve("saved");
//     });
//   });
// }







// console.log(study)
// var stud = study.create({
// // "name" : "aker.name.findName()",
// // "description" : "faker.lorem.sentence()",
// "studyKind" : "survey1",
// // "researcherName" : "faker.name.findName()",
// // "contact" : "1234567890",
// "status" : "open",
// // "goal" : _.random(1, 100),
// "invitecode" : "NEQ-RESEARCH"
// },function(error, doc) { //This saves the information you see within that Bee declaration (lines 4-6).
//   if (error){
//     console.log("ERROR HEREE", error);
//     return;
//   }
//   console.log("SAVED")
//   // done("SAVED");
//   // resolve("saved");
// });
// study.find(function (err, kittens) {
//   if (err) return console.error(err);
//   console.log(kittens);
// });
//
// function abc(done){
//   var study= Models.StudyModel;
//   console.log(study)
// study.create({
//   // "name" : "aker.name.findName()",
//   // "description" : "faker.lorem.sentence()",
//   "studyKind" : "survey1",
//   // "researcherName" : "faker.name.findName()",
//   // "contact" : "1234567890",
//   "status" : "open",
//   // "goal" : _.random(1, 100),
//   "invitecode" : "RESEARCH"
// },function(error, doc) { //This saves the information you see within that Bee declaration (lines 4-6).
//     if (error){
//       console.log("ERROR HEREE", error);
//       return;
//     }
//     console.log("SAVED")
//     done("SAVED");
//     // resolve("saved");
// });
//
// }

// abc(function(save){
//   console.log("from done", save);
// });
// function saveData(Study){
//   console.log("In SAVE STUDY")
//   return new Promise(function(resolve, reject){
//     Study.save(function(error) { //This saves the information you see within that Bee declaration (lines 4-6).
//       resolve("saved.");
//       if (error) {
//         reject(error);
//       }
//     });
//   });
// }
