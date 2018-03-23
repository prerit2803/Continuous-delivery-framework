# CSC519-Project: Test + Analysis Milestone


![SEE YOU SPACE COWBOY](https://img.youtube.com/vi/yg7V67ptg18/0.jpg)

## Team Members:
| Name | UnityId | Contribution |
|---------------------|-------|----------|
| Zachery Thomas | zithomas | iTrust Fuzzer, iTrust test Prioritizer |
| Vikas Pandey | vrpandey | Collection Schemas, MongoDB models, Documentation, Checkbox-Screencast |
| Prerit Bhandari | pbhanda2 | Automated Test Generation for checkbox.io|
| Ankur Saxena | asaxena3 | Jenkins setup for iTrust2-v2 and coverage report, Documentation  |

## Screencast
+ The screencast for [Milestone2 - iTrust2-v2](https://youtu.be/32AC1298EB8)
+ The screencast for [Milestone2 - checkbox.io](https://youtu.be/PNBee_jy8hw)

## Overview
For the Milestone2 of the project, we are provisioning local instances for our jenkins server and performing the following tasks:
+ Sets up Jenkins on a local server(Ubuntu-xenial64 VM) and configures plugins to display coverage, and test results.
+ Generates 100 fuzzed commits on iTrust2-v2 repository locally ,triggers build jobs, and generated reports (on build success) for each commit.
+ Once all fuzzed builds are finished, displays the prioritization results for all the tests of the suite.
+ Automates test generation for the checkbox.io and presents Istanbul coverage reports at the end of the playbook.  

Once you clone the repository, you can see the following file structure:
```
|-- build.yml
|-- inventory
|-- group_vars
    |-- all
        |-- vars.yml
|-- jenkins_files
    |-- itrust-test.yml 
    |-- prioritizer.yml
    |-- jenkins_job.ini
    |-- init.groovy.d
        |-- init.groovy
        |-- makeCred.groovy
        |-- remove.groovy
|-- roles
    |-- configure-jenkins
    |-- configure-itrust
    |-- itrust-fuzzer
    |-- configure-checkbox  
```

## Setup
### Setting variables
We first set variable values in [`group_vars/all/vars.yml`](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/group_vars/all/vars.yml)  
![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial_material/vault.PNG)  
You must edit following variables (don't provide blank values to any variable):

+ `mysql_password`: MySQL admin password  
+ `jenkins_port`: Jenkins Port
+ `GIT_USER`: NCSU Github account username
+ `GIT_PASSWORD`: NCSU Github account password
+ `MAIL_USER`: User for iTrust SMTP
+ `MAIL_PASSWORD`: Password for iTrust SMTP
+ `MONGO_IP`: localhost   //Setting to any other value will not guarantee that checkbox will function properly
+ `MONGO_USER`: Username to set for Mongodb
+ `MONGO_PASSWORD`: Password for Mongodb username  
+ `MONGO_PORT`: Port for Mongodb  
+ `MAIL_SMTP`: Mail SMTP  

The `MONGO_PORT` must be set to **3002** as instructed.
### Guidelines
+ The Jenkins' port address needs to be changed from 8080 to another empty port. Ensure that the port value entered in [jenkins_port](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/8f1c1e285e24aec7b612b1184d45e6be034dbd0b/group_vars/all/vars.yml#L4) is available. 
+ We created email for testing purpose that you can use: 
     + [MAIL_USER](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/8f1c1e285e24aec7b612b1184d45e6be034dbd0b/group_vars/all/vars.yml#L8): `devops.itrustv2@gmail.com`
     + [MAIL_PASSWORD](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/8f1c1e285e24aec7b612b1184d45e6be034dbd0b/group_vars/all/vars.yml#L7): `itrustv2!`
### Running the playbook

To run the playbook, you need to install [**ansible**](https://github.com/CSC-DevOps/CM/blob/master/Ansible.md) to your local machine. Then change into the project repo and run the following command to run the playbook:
```
ansible-playbook -i inventory build.yml
```
## Approach
### #1 Configuration of iTrust2-v2
The version update of iTrust2-v2 posed a minor challenge in the setup of the project. We applied following steps to resolve it:
+ **iTrust2 test:** From the [older version](https://github.ncsu.edu/vrpandey/iTrust2-v2/tree/0965f8cc0d1f7a4fae1e6c07248db1bc882bb643) of iTrust2, we used the [pom-data.xml](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/8f1c1e285e24aec7b612b1184d45e6be034dbd0b/jenkins_files/pom-data.xml#L1) to generate the test data and the [pom.xml](https://github.ncsu.edu/engr-csc326-staff/iTrust2-v2/blob/b1f340b2be4e4b03801b2de46e806ba2aed0250f/iTrust2/pom.xml#L1) from latest version to run tests.
```
 mvn -f pom-data.xml process-test-classes
 mvn clean test verify
```
+ **Coverage using Jacoco:** To display the reports of coverage, we used [Jacoco](https://plugins.jenkins.io/jacoco) plugin in Jenkins which displays reports of code coverage once the test stage is completed. Sample coverage report looks like
![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial-material/Jacoco-coverage.jpeg)

## #2 Fuzzing
Currently our [fuzzer](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/19469e684c7545ce2c8fedc370f79ff0007fdf21/iTrust-fuzzer/src/main/java/com/cowboydevop/fuzzer/Fuzzer.java#L29) can modify java files within iTrust such that:
* Comparators in if statements _(e.g. if(value == 4) )_ are flipped to reverse condition _(e.g. '==' to '!=' or '!=' to '==')_
* String literals _(e.g. "Hello World!")_ are switched to a default string value _(e.g. "new val")_
* Integer literals _(e.g. 123)_ are switched to a random integer value

### Types of problems the fuzzer discovered?
The fuzzer was able to find problems in the API calls which set parameters through strings and hence changed due to improper input values. 
### Ways fuzzer could be extended in the future?
+ Fuzzer can be extended to change float values in the code. 
+ The fuzzer currently only inverts equivalence condition but it can be extended to change inequalities.
+ Also, we can selectively modify different files in different manner like **models** can be modified to not change string values but change in some settings.
+ Config files can be included for fuzzing as well.
### Explanation for tests that were ranked the highest?
The fuzzer discovered the tests that were largely independent of the values provided in the source code. These tests took their values from either database or the environment variables so changes in the source codes didn't affect their result. The test ranked highest was **testEmail** which retrieved it's value form the `MAIL_USER` and `MAIL_PASSWROD` mentioned previously in the `vars.yml`. Fuzzing didn't help to modify it's functioning and consequently it's result was always _pass_.
## #3 Test Prioritization
Upon each run of iTrust-test, using a post build action we move the `iTrust2/target/surfire-reports` that are generated from the tests to a centeral directory. Each of the surfire-reports contains information about **which tests were _run_, which tests _failed_, and which tests _had errors_ and _how long_ each test took**.

We set up a [prioritizer Jenkins job](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/19469e684c7545ce2c8fedc370f79ff0007fdf21/jenkins_files/prioritizer.yml#L1) within Jenkins that is triggered upon every run of iTrust-test.
Our [prioritizer script](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/19469e684c7545ce2c8fedc370f79ff0007fdf21/iTrust-prioritizer/prioritizer.py#L1) records the pass rate for each test **(number of time test passes / total number of runs)** as well as the **average run time** for each test.
We sort each test within the prioritizer to show test pass rates in descending order with a secondary sort applied to the average run times. That way users can see which tests pass regardless of changes in source code. The **tests with least priority appear at the top** of the report, as shown in the sample report below as well as in the [full prioritization report](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial-material/prioritizer-final.txt).  
  
![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial-material/priority-report.gif)

## #4 Checkbox Test Automation


![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial-material/CoverageReport.png)


We first created Test Data using Mongodb Models for Study collection. Then, we created a AST for server.js file using esprima and created a dictionary where each object contains four fields:
```javascript
{
   "URL path" : "url"
   "method" : "(get/post)"
   "File(called by the url)": "file"
   "File method": "method"
}
```
Once the dictionary is created, we iterate over the dictionary and for each object we traversed the corresponding file and file-method is extracted to create a AST using visitor pattern and esprima. For each route path, we generate the constraints and stored in a json object`functionConstraints`. After creating constraints for each route path, we created test cases for each constraints using request module and appended each test case to [test.js](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/checkbox/server-side/site/test.js) file. Finally, `test.js` is executed and code-coverage is generated.

For code-coverage, we have used [istanbul-middleware](https://github.com/gotwarlost/istanbul-middleware)
In istanbul-middleware, flag `isCoverageEnabled` is checked. If `isCoverageEnabled` is set true, the code-coverage is run on the entire directory, which we mention in `im.hookLoader(dirName)` function, except the node_modules.

To check the code-coverage open url: 
`http://<IP>:<Port>/coverage`

Our code-coverage varies between `65% to 70%` due to random test data generated each time. We covered most of the endpoints by analyzing the AST of the route handler.


![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial-material/CheckboxCoverage.gif)


