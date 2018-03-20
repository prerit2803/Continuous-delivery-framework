// Core/NPM Modules
const esprima = require("esprima");
const faker   = require("faker");
const fs      = require('fs');
const Random  = require('random-js');
const _       = require('lodash');
const randexp = require('randexp');
const async = require('async');
var Models = require("../models").models;
var study= Models.StudyModel;
// Set options
faker.locale  = "en";
const options = { tokens: true, tolerant: true, loc: true, range: true };



// Create random generator engine
const engine = Random.engines.mt19937().autoSeed();


/**
* Constraint class. Represents constraints on function call parameters.
*
* @property {String}                                                          ident      Identity of the parameter mapped to the constraint.
* @property {String}                                                          expression Full expression string for a constraint.
* @property {String}                                                          operator   Operator used in constraint.
* @property {String|Number}                                                   value      Main constraint value.
* @property {String|Number}                                                   altvalue   Constraint alternative value.
* @property {String}                                                          funcName   Name of the function being constrained.
* @property {'integer'|'string'|'phoneNumber'}                                kind       Type of the constraint.
*/
class Constraint {
  constructor(properties){
    this.ident = properties.ident;
    this.expression = properties.expression;
    this.operator = properties.operator;
    this.value = properties.value;
    this.altvalue = properties.altvalue;
    this.funcName = properties.funcName;
    this.kind = properties.kind;
  }
}

  // Initialize function constraints directory
let functionConstraints = {};

/**
* Generate function parameter constraints for an input file
* and save them to the global functionConstraints object.
*
* @param   {String} filePath Path of the file to generate tests for.
* @returns {Object}          Function constraints object.
*/
async function constraints(dictionary) {

  // console.log("its here", dictionary);
  let filePath = "./routes/"+dictionary.file;
  // Read input file and parse it with esprima.
  let buf = fs.readFileSync(filePath, "utf8");
  let result = esprima.parse(buf, options);
  // Start traversing the root node
  await traverse(result, function (node) {

    // If some node is a function declaration, parse it for potential constraints.
    if (node.type === 'ExpressionStatement' && node.expression.type === "AssignmentExpression" && node.expression.left.type === "MemberExpression") {
      // console.log("DATA11",node.expression.left.object.range[0]);

      let type = buf.substring(node.expression.left.object.range[0], node.expression.left.object.range[1]);

      let funcType = buf.substring(node.expression.left.property.range[0], node.expression.left.property.range[1]);
      // console.log(node.expression.left.object, node.expression.left.property);
      // let fileDetails = buf.substring(node.expression.left.arguments[1].range[0], node.expression.left.arguments[1].range[1]).split(".");
      if(type === "exports" && funcType ===dictionary.fileMethod && node.expression.right.type === "FunctionExpression"){
        // console.log("DATA", type, funcType, dictionary.fileMethod, dictionary.file);
        let functionName = dictionary.url;
        functionConstraints[functionName] = {};
        functionConstraints[functionName]["method"] = dictionary.method.toUpperCase();
        // console.log("FC", functionConstraints[functionName].length);
        traverse(node, function(child){
          // REMOVE child.init.type
          if(child.init && child.init.type && child.init.type === "MemberExpression" && child.init.object && child.init.object.object && child.init.object.object.name === "req"){
              // console.log("CHECKING", child.init.object.property.name);
              // console.log("FC2222", functionConstraints[functionName]);
              let reqType = child.init.object.property.name;
              // if(functionConstraints[functionName].length == 0){
              //   console.log("length is zero");
              //   functionConstraints[functionName].push({
              //     constraints: {}
              //   });
              //   console.log("leng zero", functionConstraints[functionName]);
              // }

              // let varType = child.init.property.name;
              // console.log("asdasdasdas", varType);
              // var obj={
              //   String(varType):[]
              // }


              if(reqType === "query"){
                // console.log("query", child.init.property.name);
                let varType = child.init.property.name;
                functionConstraints[functionName][varType] = new Array();
              }else if(reqType === "params"){
                // console.log("params", child.init.property.name);
                let varType = child.init.property.name;
                functionConstraints[functionName][varType] = new Array();
              }else if(reqType === "body"){
                // console.log("body", child.init.property.name);
                let varType = child.init.property.name;
                functionConstraints[functionName][varType] = new Array();
                // console.log("check",varType, functionConstraints[functionName][0].varType);
              }
              // let ident = child.init.property.name;
          }else if(child.init && child.init.type && (child.init.type === "NewExpression" || child.init.type === "CallExpression") && child.init.arguments[0].type === "MemberExpression" && child.init.arguments[0].object && child.init.arguments[0].object.object && child.init.arguments[0].object.object.name === "req" ){
            // console.log("CHECKING", child.init.arguments[0].object.property.name, child.init.arguments[0].property.name);
            // console.log("FC2222", functionConstraints[functionName]);

            let reqType = child.init.arguments[0].object.property.name;
            if(reqType === "query"){
              // console.log("query2", child.init.arguments[0].property.name);
              let varType = child.init.arguments[0].property.name;
              functionConstraints[functionName][varType] = new Array();
            }else if(reqType === "params"){
              // console.log("params2", child.init.arguments[0].property.name);
              let varType = child.init.arguments[0].property.name;
              functionConstraints[functionName][varType] = new Array();
            }else if(reqType === "body"){
              // console.log("body2", child.init.arguments[0].property.name);
              let varType = child.init.arguments[0].property.name;
              functionConstraints[functionName][varType] = new Array();
              // console.log("check",varType, functionConstraints[functionName]);
            }
          }
          if(child.type == "IfStatement" && child.test && _.get(child.test, 'type') === 'BinaryExpression' && _.includes(['!=', '!==', '==', '==='], _.get(child.test, 'operator'))) {
            if(_.get(child.test, 'left.type') === 'Identifier'){
              let ident = child.test.left.name;
              let expression = buf.substring(child.test.range[0], child.test.range[1]);
              let rightHand = buf.substring(child.test.right.range[0], child.test.right.range[1]);

              let match = rightHand.match(/^['"](.*)['"]$/);
              // console.log(functionName, ident, expression, rightHand);
              let constraints = functionConstraints[functionName][ident];
              constraints.push(new Constraint({
                ident: ident,
                value: rightHand,
                funcName: functionName,
                kind: "integer",
                operator : child.test.operator,
                expression: expression
              }));
              constraints.push(new Constraint({
                ident: ident,
                value: match ? `'NEQ - ${match[1]}'` : NaN,
                funcName: functionName,
                kind: "integer",
                operator : child.test.operator,
                expression: expression
              }));
            }
          }
          if(child.type == "CallExpression" && child.arguments && child.arguments.length == 3 && child.arguments[0].name == "req" && child.arguments[1].name == "res"){
            // console.log("for fd", child.callee.name, functionName);
            functionConstraints[functionName]["helper"] = child.callee.name;
          }
        });
      }

    }
    if(node.type == "FunctionDeclaration"){
      // console.log("FP", filePath);
      // console.log("SEE ", functionConstraints[functionName], node.id.name);
    }
  });
  // console.log("FC asddafafaf HERE", functionConstraints);
  return functionConstraints;
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


/**
* Return the name of a function node.
*/
function functionName(node) {
  return node.id ? node.id.name : '';
}


/**
* Generates an integer value based on some constraint.
*
* @param   {Number}  constraintValue Constraint integer.
* @param   {Boolean} greaterThan     Whether or not the concrete integer is greater than the constraint.
* @returns {Number}                  Integer satisfying constraints.
*/
function createConcreteIntegerValue(constraintValue, greaterThan) {
  if( greaterThan ) return Random.integer(constraintValue + 1, constraintValue + 10)(engine);
  else return Random.integer(constraintValue - 10, constraintValue - 1)(engine);
}
// getData('studyKind', 'survey').then(function(res){
//   console.log("ID HERE", res._id, res.token, res.studyKind);
// })
// function getData(type, val){
//   let temp = {};
//   temp[type] = val;
//   console.log("te", temp)
//     return new Promise(function(resolve, reject){
//       study.findOne(temp,function (err, kittens) {
//         if (err) return console.error(err);
//         console.log("ID HERE", kittens._id, kittens.token);
//         resolve(kittens);
//       });
//     });
// }

// Export
module.exports = constraints;
