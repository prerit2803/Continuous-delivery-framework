# Deployment + Rolling Update

## Steps to run:
+ Clone the repo and change directory to `Deployment+RollingUpdate` folder
+ Install [Ansible](./getAnsible.sh)
+ Fill in all of the varibales value in [group_vars](./group_vars/all/vars.yml)
```
    ---
  env_vars:
    mysql_user: ""
    mysql_password: ""
    jenkins_port: ""
    ACCESS_KEY: ""
    SECRET_KEY: ""
    GIT_USER: ""
    GIT_PASSWORD: ""
    MAIL_PASSWORD: ""
    MAIL_USER: ""
    MAIL_SMTP: ""
    MONGO_PORT: ""
    MONGO_IP: ""
    MONGO_USER: ""
    MONGO_PASSWORD: ""
```
+ Run the following to start deployment of Jenkins, iTrust and Checkbox.io
  ```
    ansible-playbook -i inventory deploy.yml
  ```
+ Run the following to make changes, commit and push to bare repo.
  ```
    ./pipeline_tester.sh
  ```
## Description
The playbook provision 9 instances of the following: 5 instances for iTrust, 1 for MySQL, 1 instance for Checkbox.io, and 1 for Monitoring Server. All the instances are configured as per the functionality.
When the shell script is ran, it creates a bare repo for both iTrust and Checkbox.io and also, create a `post-receive` file which jenkins trigger. Then the script creates an empty `README.md` and put some content. It also commits and push the changes to the repo.
When the build is triggerred through the push, all the instances are redeployed.

## Screencast
The screencast for Milestone3 - [ Deployment and Rolling Update ](https://youtu.be/OgyeE7KXN0s)

![](../tutorial-material/Pipeline.png)
