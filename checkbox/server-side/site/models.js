var mongoose = require('mongoose');


  mongoose.connect('mongodb://localhost:27017/site');

  var StudyModel =
    mongoose.model('StudyModel', require('./studySchema'), 'studies');
  var VoteModel =
    mongoose.model('VoteModel', require('./voteSchema'), 'votes');

  var models = {
    StudyModel: StudyModel,
    VoteModel: VoteModel
  };

  module.exports.models=models;
