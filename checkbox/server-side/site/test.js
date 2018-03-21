const request = require('request');



var options = {
 uri: 'http://localhost:3002/api/study/vote/submit/',
 method: 'POST',
 json: {
	'studyId': '5ab001a23faedc2d4a83a237',
	'fingerprint': 'QMR9jrJyVgal',
	'answers': '{"Question1": "Possimus nemo tempora laudantium deserunt. Fugit vel vel quia consequatur quam. Veniam accusantium eveniet corporis saepe sed facilis.", "Question2": "Laborum qui necessitatibus aut nesciunt iure autem beatae iste odit. Quae non optio sed. Ipsam facere ut occaecati perspiciatis laudantium quis autem labore dicta. Est hic excepturi vero est modi. Quaerat exercitationem sit officia mollitia impedit fugit assumenda in. Nemo qui fugit."}',
	'email': 'Jedediah.Legros49@hotmail.com',
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
	'studyKind': 'dataStudy',
	'invitecode': "RESEARCH"
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/create',
 method: 'POST',
 json: {
	'studyKind': 'dataStudy',
	'invitecode': 'NEQ - RESEARCH'
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
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': "AMZN"
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': 'NEQ - AMZN'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': "SURFACE"
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': 'NEQ - SURFACE'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': "IPADMINI"
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': 'NEQ - IPADMINI'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': "GITHUB"
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': 'NEQ - GITHUB'
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': "BROWSERSTACK"
}

};

request(options, function (error, response, body) {
if (!error && response.statusCode == 200) {}
});


var options = {
 uri: 'http://localhost:3002/api/study/admin/notify/',
 method: 'POST',
 json: {
	'email': 'Jedediah.Legros49@hotmail.com',
	'kind': 'NEQ - BROWSERSTACK'
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