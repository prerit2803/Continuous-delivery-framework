var im = require('istanbul-middleware'),
    isCoverageEnabled = true; // or a mechanism of your choice

//before your code is require()-ed, hook the loader for coverage
if (isCoverageEnabled) {
    console.log('Hook loader for coverage - ensure this is not production!');
    im.hookLoader(__dirname);
        // cover all files except under node_modules
        // see API for other options
}
var mongo = require('mongodb'),express = require('express'), cors = require('cors');
var StudyModel = require('./routes/studyModel.js');
var db=null;
var MongoClient = mongo.MongoClient;
/*MongoClient.connect("mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@"+process.env.MONGO_IP+":27017/site?authSource=admin", function(err, authdb) {
  // Now you can use the database in the db variable
  db = authdb;
  console.log( err || "connected!" );
});*/
var Sinon = require('sinon');
var admin = require('./routes/admin.js');
var study = require('./routes/study.js');
var create = require('./routes/create.js');
var app = express();
var istanbulapp = express();
// var sinonmongoose= require('sinon-mongoose');

if (isCoverageEnabled) {
    //enable coverage endpoints under /coverage
  app.use('/coverage', im.createHandler());
}

//add your router and other endpoints
//...

// app.listen(80);
//var StudyModel = mongoose.model('studies');
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
// var MongoMock = Sinon.mock(MongoClient);
// var DBMock = Sinon.mock(mongo.Db.prototype);
var CollectionMock = Sinon.mock(mongo.Collection.prototype);
// var CollectionMock2 = Sinon.mock(mongo.Collection.prototype);
// var CollectionStudiesMock = Sinon.mock(mongo.studies.prototype);
// MongoMock.expects('connect').resolves(DBMock);
// DBMock.expects('collection').yields(null,CollectionMock2);
// DBMock.expects('votes').yields(null,CollectionMock);
var result={test: "test"};
var result2={test: "test4444"};
// CollectionMock.expects('findOne').yields(null,result);
// CollectionMock2.expects('find').yields(null,result2);

// var models = require('./models').models;
// Study = models.StudyModel;

// Sinon.mock(Study).expects('findOne').yields(result);


// Sinon.stub("db","collection").yields("test","des","",null,null,null,null,null,null,null);
var whitelist = ['http://chrisparnin.me', 'http://pythontutor.com', 'http://happyface.io', 'http://happyface.io:8003', 'http://happyface.io/hf.html'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};
app.options('/api/study/vote/submit/', cors(corsOptions));

app.get('/api/study/load/:id', study.loadStudy );
app.get('/api/study/vote/status', study.voteStatus );
app.get('/api/study/status/:id', study.status );

app.get('/api/study/listing', study.listing );

app.post('/api/study/create', create.createStudy );
app.post('/api/study/vote/submit/', cors(corsOptions), study.submitVote );

//// ADMIN ROUTES
app.get('/api/study/admin/:token', admin.loadStudy );
app.get('/api/study/admin/download/:token', admin.download );
app.get('/api/study/admin/assign/:token', admin.assignWinner);

app.post('/api/study/admin/open/', admin.openStudy );
app.post('/api/study/admin/close/', admin.closeStudy );
app.post('/api/study/admin/notify/', admin.notifyParticipant);

// istanbulapp.listen(8080);
app.listen(process.env.MONGO_PORT);
console.log('Listening on port 3002...');
