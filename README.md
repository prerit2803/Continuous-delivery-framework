# CSC519-Project: Deployment + Infrastructure Milestone


![SEE YOU SPACE COWBOY](https://img.youtube.com/vi/yg7V67ptg18/0.jpg)

## Team Members:
| Name | UnityId |
|---------------------|-------|
| Zachery Thomas | zithomas | 
| Vikas Pandey | vrpandey | 
| Prerit Bhandari | pbhanda2 |
| Ankur Saxena | asaxena3 |

## Screencast
+ The screencast for [Milestone2 - iTrust2-v2](https://youtu.be/32AC1298EB8)
+ The screencast for [Milestone2 - checkbox.io](https://youtu.be/PNBee_jy8hw)

## Overview

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
