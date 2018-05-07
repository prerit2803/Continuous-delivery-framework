# CSC519-Project: Deployment + Infrastructure Milestone


![SEE YOU SPACE COWBOY](https://img.youtube.com/vi/yg7V67ptg18/0.jpg)

## Team Members:
| Name | UnityId | 
|---------------------|-------|
| Zachery Thomas | zithomas |
| Vikas Pandey | vrpandey |
| Prerit Bhandari | pbhanda2 |
| Ankur Saxena | asaxena3 | 

## Features

### Code Review


### Monitoring and Notification

Purpose: To continuously monitor our servers for KPI's and raise a notification(email/messgae) in case of an alert.

Solutions: We used AWS Cloudwatch service to manage a dashboard for KPI's such as CPU utilization, status of the servers, NetworkIn, etc. An alarm was raised if any KPI value crossed its critical/threshold value and AWS Simple Notification Service was used to send an alert email.

Tools/Technologies used: AWS Cloudwatch, AWS SNS


![image]( https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone4/CanaryRelease/Cloudwatch_dashboard.png "Monitoring Dashboard")

