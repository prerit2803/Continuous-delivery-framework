/**
 * NodeJS Test Generation Module
 */


// Core/NPM Modules
const esprima = require("esprima");
const path    = require('path');
const fs      = require('fs');
const async = require('async');


var populateData = require('./populateData').data;
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
(module.exports.main = async function() {
    // console.log("asdas",buf);
    // Parse file input, defaulting to subject.js if not provided
    // let args = process.argv.slice(2);
    // if( args.length === 0 ) {
    //     args = ["./routes/"];
    // }
    let filePath = path.resolve("server.js");
    let buf = fs.readFileSync(filePath, "utf8");
    // console.log(buf);
    let result = esprima.parse(buf, options);

    traverse(result, function (node) {
      if (node.type === 'ExpressionStatement' && node.expression.type=="CallExpression"
    && node.expression.callee && node.expression.callee.property &&
    (node.expression.callee.property.name=="get" || node.expression.callee.property.name=="post") && node.expression.arguments[0].value != "/api/design/survey") {
        // console.log(node.expression.callee.property.name, node.expression.arguments[0].value);
        let arg = node.expression.arguments;
        let fileDetails = buf.substring(arg[arg.length - 1].range[0], arg[arg.length - 1].range[1]).split(".");
         // console.log("DATA", fileDetails[0], fileDetails[1]);
         dictionary.push({
           method: node.expression.callee.property.name,
           url: node.expression.arguments[0].value,
           file: fileDetails[0]+'.js',
           fileMethod: fileDetails[1]
         });
      }
    });
    dictionary.sort(function(a,b){
      // console.log("checking: "+a.status+" "+b.status);
      if(a.method == b.method){
        // console.log("SAME")
        return 1;
      }
      else if(a.method == "post"){
        // console.log("A Passed")
        return -1
      }
      else {
        // console.log("B Passed")
        return 1;
      }
    });
    // study.find(function (err, kittens) {
    //   if (err) return console.error(err);
    //   console.log("ID ALL", kittens);
    // });
    // console.log("DICSSS",dictionary);
    let functionConstraints = null
    var stream = fs.createWriteStream('test.js');
    stream.write("const request = require('request');\n");


    // await asyncLoop(dictionary, async function (item, next){
    //   // console.log("item",item);
    // functionConstraints = addConstraints(dictionary);
    //   // study.findOne(function (err, kittens) {
    //   //   if (err) return console.error(err);
    //   //   console.log("ID HERE", kittens._id, kittens.token);
    //   // });
    //   // console.log("FC IS HERE", functionConstraints);
    getData().then(function(res){
      // console.log("res",res);
      addConstraints(dictionary).then(function(result){
        // console.log("ehre", res);
          generateTestCases(stream,res, result);
      });
    });

    //   next();
    // });
    // console.log("FC IS HERE", functionConstraints);
    // generateTestCases(functionConstraints);
    // Initialize constraints based on input file
    // let functionConstraints = constraints(filePath);
    //
    // // Generate test cases
    // generateTestCases(filePath, functionConstraints);

})();
// console.log(dictionary, dictionary.length);
function addConstraints(dic){
  let functionConstraints = null;
  for(var i = 0 ;i < dic.length; i++){
    functionConstraints = constraints(dic[i]);
    // generateTestCases(str, functionConstraints);
  }
  return functionConstraints;
  // console.log("FC IS HERE", functionConstraints);
  // Generate test cases
  // generateTestCases(filePath, functionConstraints);
}
function getData(){
  // console.log("CHECKS");
    return new Promise(function(resolve, reject){
      // console.log("now here");
      study.findOne(function (err, kittens) {
        if (err) return console.error(err);
        console.log("ID HER in getE", kittens._id, kittens.token);
        resolve(kittens);
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
