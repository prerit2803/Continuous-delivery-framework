# Canary Realease

Canary release is a technique to reduce the risk of introducing a new software version in production by slowly rolling out the change to a small subset of users before rolling it out to the entire infrastructure and making it available to everybody.


## Steps to Implement Canary Release

1. Provision your servers(Production and Canary)

2. For single instance of MongoDB we have provisioned a third server with mongodb running on it and the ip of our MongoDB server is used while provisioning our servers. Also in /etc/mongod.conf file you have to change the bind-ip value to allow your servers to connect to your mongodb.

3. Once you servers setup is completed and all servers are up, save you ip address of stable and canary server in stableInstance and canaryInstance file respectively. 

4. Run your canary.js file which sends 75% of our requests to Stable server and 25% to Canary Server.

5. To raise an alert you can stop your canary server.

5. Once alert is raised, all 100% requests are sent to our stable server.



![image]( https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone3/CanaryRelease/Canary.png "Canary Release")



## Screencast
The screencast for Milestone3 - [Canary Release Demo](https://youtu.be/xv2Xlu7iNNs)




![](../tutorial-material/Canary-Release.gif)
