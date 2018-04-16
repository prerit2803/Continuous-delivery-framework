# Deployment + Rolling Update

## Steps to run:
+ Clone the repo
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
  
## Screencast
The screencast for Milestone3 - [ Deployment and Rolling Update ](https://youtu.be/OgyeE7KXN0s)

![](../tutorial-material/Pipeline.png)
