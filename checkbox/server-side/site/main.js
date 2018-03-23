/**
 * NodeJS Test Generation Module
 */


// Core/NPM Modules
const esprima = require("esprima");
const path    = require('path');
const fs      = require('fs');
const async = require('async');


var populateData = require('./populateData');
var Models = require("./models").models;
var asyncLoop = require('node-async-loop');

// Local Modules
const constraints       = require('./src/constraint');
const generateTestCases = require('./src/testgenerator');
const options = { tokens: true, tolerant: true, loc: true, range: true };
var study= Models.StudyModel;
// Polyfills
// require('./src/format-polyfill');



/**
 * Parse an input file and generate test cases for it.
 */
 var dictionary = [];
(module.exports.main = function() {
 
    let filePath = path.resolve("server.js");
    let buf = fs.readFileSync(filePath, "utf8");

    let result = esprima.parse(buf, options);

    traverse(result, function (node) {
      if (node.type === 'ExpressionStatement' && node.expression.type=="CallExpression"
    && node.expression.callee && node.expression.callee.property &&
    (node.expression.callee.property.name=="get" || node.expression.callee.property.name=="post") && node.expression.arguments[0].value != "/api/design/survey") {
       
        let arg = node.expression.arguments;
        let fileDetails = buf.substring(arg[arg.length - 1].range[0], arg[arg.length - 1].range[1]).split(".");
       
         dictionary.push({
           method: node.expression.callee.property.name,
           url: node.expression.arguments[0].value,
           file: fileDetails[0]+'.js',
           fileMethod: fileDetails[1]
         });
      }
    });
    dictionary.sort(function(a,b){
      
      if(a.method == b.method){
       
        return 1;
      }
      else if(a.method == "post"){
      
        return -1
      }
      else {
  
        return 1;
      }
    });
  
    let functionConstraints = null
    var stream = fs.createWriteStream('test.js');
    stream.write("const request = require('request');\n");

    getData().then(function(res){
      addConstraints(dictionary).then(function(result){
          generateTestCases(stream,res, result);
      });
    });


})();
function addConstraints(dic){
  let functionConstraints = null;
  for(var i = 0 ;i < dic.length; i++){
    functionConstraints = constraints(dic[i]);
  }
  return functionConstraints;

}
function getData(){
    return new Promise(function(resolve, reject){
      study.findOne(function (err, stud) {
        if (err) return console.error(err);
        resolve(stud);
      });
    });
}
/**
* Traverse an object tree, calling the visitor at each
* visited node.
*
* @param {Object}   object  Esprima node object.
* @param {Function} visitor Visitor called at each node.
*/
function traverse(object, visitor) {

  // Call the visitor on the object
  visitor(object);

  // Traverse all children of object
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      let child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child, visitor);
      }
    }
  }
}
