var mongoose = require('mongoose');


  mongoose.connect('mongodb://localhost:27017/site');

  var StudyModel =
    mongoose.model('StudyModel', require('./studySchema'), 'studies');
  var VoteModel =
    mongoose.model('VoteModel', require('./voteSchema'), 'votes');
  // var User =
  //   mongoose.model('User', require('./user'), 'users');

  var models = {
    StudyModel: StudyModel,
    VoteModel: VoteModel
    //User: User
  };

// console.log("in Models", models)

  module.exports.models=models;
