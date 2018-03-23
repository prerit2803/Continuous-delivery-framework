var im = require('istanbul-middleware'),
    isCoverageEnabled = true; // or a mechanism of your choice
// Reference: https://github.com/gotwarlost/istanbul-middleware
//before your code is require()-ed, hook the loader for coverage
if (isCoverageEnabled) {
    console.log('Hook loader for coverage - ensure this is not production!');
    im.hookLoader(__dirname);
        // cover all files except under node_modules
        // see API for other options
}
var mongo = require('mongodb'),express = require('express'), cors = require('cors');
var StudyModel = require('./routes/studyModel.js');

var Sinon = require('sinon');
var admin = require('./routes/admin.js');
var study = require('./routes/study.js');
var create = require('./routes/create.js');
var app = express();

if (isCoverageEnabled) {
    //enable coverage endpoints under /coverage
  app.use('/coverage', im.createHandler());
}

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

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

app.listen(process.env.MONGO_PORT);
console.log('Listening on port 3002...');
