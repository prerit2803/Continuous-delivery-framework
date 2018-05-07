# CSC519-Project: Deployment + Infrastructure Milestone


![SEE YOU SPACE COWBOY](https://img.youtube.com/vi/yg7V67ptg18/0.jpg)

## Team Members:
| Name | UnityId | Contribution |
|---------------------|-------|-----|
| Zachery Thomas | zithomas | Gerrit Setup, Gerrit Demo |
| Vikas Pandey | vrpandey | Monitoring and Notification | 
| Prerit Bhandari | pbhanda2 | Monitoring and Notification |
| Ankur Saxena | asaxena3 | Presentation and Demo |

## [Screencast](https://youtu.be/G25nLDc0o44)


## Features

### Gerrit Code Review

Purpose: During the duration of this project in DevOps all members were allowed to contribute any code to our github repository. Sometimes changes were submitted that were buggy, formatted poorly or just kind of hacky. Having peers review your code before submitting it to a repository would prevent small imperfections and easily preventable bugs from compounding in your codebase. It also allows teammates to better collaborate and have a say about which direction the project should go in.

Solutions: We used a Dockerized version of Gerrit to host copies of Checkbox.io and iTrust. That way we could upload changes to Gerrit, submit, amend or abort those changes before they are submitted to the repo, and then build those changes using Jenkins. After that the pipeline for deployment mirrors that of Milestone 3. Instructions on how to clone and push to the Gerrit copies of each repo can be found [here.](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone4/Deployment%2BRollingUpdate/HOW%20TO%20COMMIT%20TO%20GERRIT.md)

Tools/Technologies used: Docker, Gerrit

![Gerrit Infrastucture Example](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone4/tutorial-material/GerritInfra.png)

### Monitoring and Notification

Purpose: To continuously monitor our servers for KPI's and raise a notification(email/messgae) in case of an alert.

Solutions: We used AWS Cloudwatch service to manage a dashboard for KPI's such as CPU utilization, status of the servers, NetworkIn, etc. An alarm was raised if any KPI value crossed its critical/threshold value and AWS Simple Notification Service was used to send an alert email.

Tools/Technologies used: AWS Cloudwatch, AWS SNS


![image]( https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone4/CanaryRelease/Cloudwatch_dashboard.png "Monitoring Dashboard")

