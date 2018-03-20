const request = require('request');



var options = {
 uri: 'http://localhost:3002/api/study/vote/submit/',
 method: 'POST',
 json: {
	'studyId': '5ab001a23faedc2d4a83a237',
	'fingerprint': 'yHYwFIE1EPLQ',
	'answers': '{"Question1": "Rerum aperiam dolor fugiat nihil mollitia. Necessitatibus est ad voluptatum non ipsa. Exercitationem sit praesentium.", "Question2": "Officia corporis in qui beatae minus et perferendis. Adipisci a quo voluptas omnis. Nisi error aliquid architecto. Sit esse ut aut. Sit est et quia ut et veritatis debitis voluptatem sit. Asperiores suscipit est vitae quibusdam impedit aspernatur sequi."}',
	'email': 'Katelyn_Nader19@gmail.com',
	'contact': '705.636.5982'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/create',
 method: 'POST',
 json: {
	'studyKind': 'dataStudy'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/open/',
 method: 'POST',
 json: {
	'token': '83Cu1JbeZQcHoqnGjjnNpCgCuj9oneUz'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/close/',
 method: 'POST',
 json: {
	'token': '83Cu1JbeZQcHoqnGjjnNpCgCuj9oneUz'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Katelyn_Nader19@gmail.com'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/83Cu1JbeZQcHoqnGjjnNpCgCuj9oneUz',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/load/5ab001a23faedc2d4a83a237',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/status/5ab001a23faedc2d4a83a237',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/listing',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/assign/83Cu1JbeZQcHoqnGjjnNpCgCuj9oneUz',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/download/83Cu1JbeZQcHoqnGjjnNpCgCuj9oneUz',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/vote/status',
 method: 'GET'
};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});