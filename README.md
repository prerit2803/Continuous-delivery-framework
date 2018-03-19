# CSC519-Project


![SEE YOU SPACE COWBOY](https://img.youtube.com/vi/yg7V67ptg18/0.jpg)

## Team Members:
| Name | UnityId | Contribution |
|---------------------|-------|----------|
| Zachery Thomas | zithomas |  |
| Vikas Pandey | vrpandey |  |
| Prerit Bhandari | pbhanda2 | |
| Ankur Saxena | asaxena3 |  |

## Screencast
+ The screencast for [Milestone2 - iTrust2-v2]()
+ The screencast for [Milestone2 - checkbox.io]()

## Success Demo
### iTrust  
    ![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial_material/itrust-demo.gif)   

### Checkbox.io    
    ![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial_material/checkbox-demo.gif)

## Overview
For the Milestone2 of the project, we are provisioning local instances for our jenkins server and performing the following tasks:
+ Setting up Jenkins on a local server(ubuntu xenial VM) and configuring plugins to display coverage, and test results.
+ Generates 100 fuzzed commits on iTrust2-v2 repository locally ,triggers build jobs, and generated reports(on build success) for each commit.
+ Once all fuzzed builds are finished, displays the prioritization results for all the tests of the suite.
+ Automates test generation for the chickbox.io and presents Instanbul coverage reports at the end of the playbook.  
Once you clone the repository, you can see the following file structure:
```
|-- build.yml
|-- inventory
|-- group_vars
    |-- all
        |-- vars.yml
|-- jenkins_files
    |-- itrust-test.yml
    |-- init.groovy.d
        |-- init.groovy
        |-- makeCred.groovy
        |-- remove.groovy
|-- roles
    |-- configure-jenkins
    |-- configure-checkbox
    |-- configure-itrust
    |-- itrust-fuzzer
    |-- checkbox-test    
```

## Setup
### Setting variables
We first set variable values in [`group/all/vars.yml`](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/group_vars/all/vars.yml)  
![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone2/tutorial_material/vault.PNG).  
You must edit following variables (don't provide blank values to any variable):

+ `mysql_password`: MySQL admin password
+ `GIT_USER`: NCSU Github account username
+ `GIT_PASSWORD`: NCSU Github account password
+ `MAIL_USER`: User for SMTP
+ `MAIL_PASSWORD`: Password for SMTP
+ `MONGODB_IP`: localhost   //Setting to any other value will not guarantee that checkbox will function properly
+ `MONGODB_USER`: Username to set for Mongodb
+ `MONGODB_PASS`: Password for Mongodb username
Besides these values, the `MONGO_PORT` is being set to **3002** as instructed.
### Guidelines

### Running the playbook

To run the playbook, you need to install [**ansible**](https://github.com/CSC-DevOps/CM/blob/master/Ansible.md) to your local machine. Then change into the project repo and run the following command to run the playbook:
```
ansible-playbook -i inventory build.yml
```
## Approach
### 1. Configuration of iTrust2-v2
### 2. Fuzzing
### 3. Test Prioritization
### 4. Checkbox Test Automation


The version update of iTrust2-v2 posed a minor challenge in the setup of the project. 
