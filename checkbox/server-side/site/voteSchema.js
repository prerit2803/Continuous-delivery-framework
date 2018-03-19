var mongoose = require('mongoose');

var voteSchema = {
  // _id: new mongoose.Types.ObjectId,
  // studyId: mongoose.Types.ObjectId,
  // timestamp: new mongoose.Types.ObjectId,
  ip: String,
  fingerprint: String,
  answers:  {type: String} ,
  email: String,
  contact: String
};

module.exports = new mongoose.Schema(voteSchema);
module.exports.voteSchema = voteSchema;
