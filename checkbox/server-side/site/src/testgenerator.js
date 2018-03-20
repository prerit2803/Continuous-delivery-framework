// Core/NPM Modules
const product = require('iter-tools/lib/product');
const fs      = require("fs");
// const mock    = require('mock-fs');
const _       = require('lodash');
const async = require('async');
const sleep = require('sleep');
var faker = require("faker");
var randomstring = require("randomstring");
faker.locale  = "en";
var Models = require("../models").models;
var study= Models.StudyModel;



/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} functionConstraints Constraints object as returned by `constraints`.
 */
async function generateTestCases(stream, info, functionConstraints) {

    // let filePath = "./routes/"+dictionary.file;
    // Content string. This will be built up to generate the full text of the test string.

    // console.log("INFO", info);
    var studyId = info._id;
    var contact = info.contact;
    var studyKind = info.studyKind;
    var token = info.token;
    var fingerprint = randomstring.generate(12);
    var email = faker.internet.email();
    var answers = `{"Question1": "${faker.lorem.paragraph()}", "Question2": "${faker.lorem.paragraph()}"}`
    // functionConstraints.then(function(result){
     // console.log(result);
     for ( let funcName in  functionConstraints){
       let requestType = functionConstraints[funcName]["method"];
       let content = "";
       // console.log("FC ",funcName, functionConstraints[funcName]);
       let indexOfColon = funcName.indexOf(":");
       let url = "";
       var needData = [false, false];
       // console.log("USR",funcName);
       if(indexOfColon > -1 ){
         if(funcName.indexOf("id") > -1){
           needData[0] = true;
         }else if(funcName.indexOf("token") > -1){
           needData[1] = true;
         }
         url = funcName.substring(0, indexOfColon);
       }else{
         url = funcName;
       }
       // console.log("bool", needData[0], needData[1])
       content += `\n\n\nvar options = {\n uri: 'http://localhost:3002${url}`;
       if(needData[0]){
         // console.log("NEED DATA", info._id);
         content += studyId;
       }
       else if(needData[1]){
         // console.log("NEED TOKEN", info.token);
         content += token;
       }
       content += `',\n method: '${requestType}'`;
       if(requestType == "POST"){
         content += ',\n json: {';
       }
      for(let constraint in functionConstraints[funcName]){
        if(constraint == "method" || constraint == "helper")
          continue;
        let param = functionConstraints[funcName][constraint];
        // console.log("Details", constraint, param, param.length);
        if(requestType === "POST"){
          if(param.length === 0){
            content += `\n\t'${constraint}': '${eval(constraint)}',`;
          }
        }
      }
      if(requestType === "POST"){
        content = content.slice(0, -1);
        content += "\n}\n";
      }

       content += "\n};\n\nrequest(options, function (error, response, body) {\nif (!error && response.statusCode == 200) {}\n});";
       stream.write(content);
     }
   // })

    // Iterate over each function in functionConstraints
    // for ( let funcName in  functionConstraints){
    //   console.log("FC",funcName);
      //   let indexOfColon = endpoint.indexOf(":");
      //   let url = "";
      //   var needData = [false, false];
      //   if(indexOfColon > -1 ){
      //     if(endpoint.indexOf("id") > -1){
      //       needData[0] = true;
      //     }else if(endpoint.indexOf("token") > -1){
      //       needData[1] = true;
      //     }
      //     url = endpoint.substring(0, indexOfColon);
      //   }else{
      //     url = endpoint;
      //   }
      //   content += `\n\n\nvar options = {\n uri: 'http://localhost:3002${url}'`;

        // const que=study.findOne(function (err, stud) {
        //   console.log("kjhgfdghj");
        //   if(needData[0]){
        //     content += stud._id;
        //   }else if(needData[1]){
        //     content += stud.token;
        //   }
        // });


        // sleep.sleep(2);
        // await que.exec();
        // if(needData[0]){
        //   console.log("NEED ID");
        //   study.findOne(function (err, stud) {
        //     if (err) return console.error(err);
        //     console.log("ID HERE", stud._id);
        //     content += stud._id;
        //   });
        //   console.log("NEED ID after");
        // }else if(needData[1]){
        //   console.log("NEED TOKEN");
        //   study.findOne(function (err, stud) {
        //     if (err) return console.error(err);
        //     console.log("token HERE", stud.token);
        //     content += stud.token;
        //   });
        // }
        // content += `,\n method: '${functionConstraints["method"]}'`;
        // if(functionConstraints["method"] == "POST"){
        //   content += ',\njson: {\n';
        // }
        // Reference all constraints for funcName.
        // let params = functionConstraints[funcName].params;
        //
        // // Get constraints and map to values
        // let constraints = functionConstraints[funcName].constraints;
        // let values =  _.mapValues(constraints, (arr) => _.map(arr, c => c.value));
        //
        // // Generate possible combinations of arguments
        // let argCombinations = product(..._.map(params, p => !_.isEmpty(values[p]) ? values[p] : ["''"]));
        //
        // // Handle global constraints...
        // // Whether or not any constraint is of type fileWithContent of fileExists.
        // let allConstraints = _.flattenDeep(_.map(constraints));
        // let fileWithContent = _.some(allConstraints, { kind: 'fileWithContent' });
        // let pathExists      = _.some(allConstraints, { kind: 'fileExists' });
        //
        // // Generate function argument strings from parameter objects.
        // for (let combination of argCombinations) {
        //
        //     // Get final argument string
        //     let args = combination.join(', ');
        //
        //     // If some constraint is of type fileWithContent or pathExists
        //     // Generate all combinations of file system test cases.
        //     if( pathExists || fileWithContent ) {
        //         content += generateMockFsTestCases(true,  true,  funcName, args);
        //         content += generateMockFsTestCases(false, true, funcName, args);
        //         content += generateMockFsTestCases(true,  false,funcName, args);
        //         content += generateMockFsTestCases(false, false, funcName, args);
        //     }
        //     // Otherwise, just generate the naive test of calling the function
        //     // with default arguments and alternative arguments.
        //     else {
        //         content += `try { ${ "subject.{0}({1});".format(funcName, args) } } catch (e) {} \n`;
        //     }
        //
        // }
        // content += "\n};\n\nrequest(options, function (error, response, body) {\nif (!error && response.statusCode == 200) {}\n});)";
    // }
  // }
    // Write final content string to file test.js.


}


/**
 * Generate test cases for constraints dealing with whether or not a file exists.
 *
 * @param   {Boolean} pathExists      Whether or not to mock the path existing.
 * @param   {Boolean} fileWithContent Whether or not to mock the file existing with content.
 * @param   {String}  funcName        Name of the function under test.
 * @param   {String}  args            Function argument string.
 * @returns {string}                  Full text of the generated file system test.
 */
// function generateMockFsTestCases (pathExists, fileWithContent, funcName, args) {
//
//     // Partial test data
//     let testCase = "";
//     let mergedFS = {};
//
//     // Add mock data for path if pathExists is true.
//     if( pathExists ) {
//         for (let attrname in mockFileLibrary.pathExists) {
//             mergedFS[attrname] = mockFileLibrary.pathExists[attrname];
//         }
//     }
//
//     // Add mock data for content if fileWithContent is true.
//     if( fileWithContent ) {
//         for (let attrname in mockFileLibrary.fileWithContent) {
//             mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname];
//         }
//     }
//     // Generate and return test case string.
//     testCase += 'try{\n';
//     testCase += `\tmock(${JSON.stringify(mergedFS).replace(/"/g, '')});\n`;
//     testCase += `\t\tsubject.${funcName}(${args});\n`;
//     testCase += "\tmock.restore();\n";
//     testCase += '} catch(e) {}\n';
//     return testCase;
// }


// Export
module.exports = generateTestCases;
