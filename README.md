# CSC519-Project

## Team Members:
+ Zachery Thomas (zithomas)
+ Vikas Pandey (vrpandey)
+ Prerit Bhandari (pbhanda2)
+ Ankur Saxena (asaxena3)

## Directory Structure
Once you clone the repository, you can see the following file structure
```
|-- build.yml
|-- deploy-checkbox.yml
|-- deploy-itrust.yml
|-- build-inventory
|-- deploy-inventory
|-- group
    |-- jenkins
        |-- vars.yml
|-- jenkins_files
    |-- itrust.yml
    |-- checkbox.yml
    |-- init.groovy.d
        |-- init.groovy
        |-- makeCred.groovy
        |-- remove.groovy
|-- roles
    |-- provision-jenkins
    |-- configure-jenkins
    |-- provision-checkbox
    |-- configure-checkbox
    |-- provision-itrust
    |-- configure-itrust
    |-- deploy-checkbox
    |-- deploy-itrust
```

## Setup
We first set the following values in `group/jenkins/vars.yml` which is our ansible vault:
`mysql_password`: MySQL admin password
`ACCESS_KEY`: Secret access key for AWS account
`SECRET_KEY`: Secret key for AWS account
`GIT_USER`: NCSU Github account username
`GIT_PASSWORD`: NCSU Github acccount password
`MONGODB_IP`: localhost   //Setting to any other value will not guarantee a success
`MONGODB_USER`: Username to set for Mongodb
`MONGODB_PASS`: Password for Mongodb username
`MONGODB_MAIL_USER`: Email for Mongodb
`MONGODB_MAIL_PASSWORD`: Password for Mongodb email
`MONGODB_MAIL_SMTP`: SMTP for Mongodb
Besides these values, the `MONGODB_PORT` is being set to **3002** as instructed.

### Editing values in vault
Theses values can be edited by accessing the ansible vault using the command `ansible-vault edit group_vars/jenkins/vars.yml`
Edit the values in the 
