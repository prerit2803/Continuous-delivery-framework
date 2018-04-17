# Infrastructure Upgrade

## Demos
[Redis Feature Flag](https://youtu.be/EVDjo-KJ-40)  
[Kubernetes](https://youtu.be/PyV4RplfIQI)

## Kubernetes Network

### Steps to run
#### 1. Clone the repository
Clone the repository on your local machine in the $HOME directory and change into the __Infrastructure__ folder by running `cd $HOME/CSC519-Project/Infrastructure`.
#### 2.  Set environment variables in the [group_vars/all/vars.yml](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/74876a5b22a733d8c2fcebb3d39909893e7b2ae6/Infrastructure/group_vars/all/vars.yml#L1)  
+ __AWS_ACCESS_KEY_ID__ : AWS account Access key
+ __AWS_SECRET_ACCESS_KEY__ : AWS account secret key
+ __MAIL_USER__ : Mongodb mail user
+ __MAIL_PASSWORD__ :  Mongodb mail password
+ __MAIL_SMTP__ : Mongodb mail smtp
+ __MONGO_USER__ : Mongodb user
+ __MONGO_PASSWORD__ : Mongodb user's password

#### 3. Run the playbook
Run the playbook using the following command `ansible-playbook -i inventory deploy-kube.yml`


### Kubernetes Infrastructure overview
We have created a Kubernetes cluster of 3 nodes with 1 master and 2 slaves on AWS.  
The kubernets maintains a Checkbox containers i.e. Checkbox pod running on the network at all times. So as long as one of the slaves is working on the cluster, the kubernetes master can keep he service up without the external user realizing about the slave failures. Diagram below explains the concept.

![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone3/tutorial-material/k8s.png)


## Redis Feature Flag
### Steps to Run
#### 1. Install Docker and Docker-Compose
For this demo we will be using Docker and Docker-Compose to manage our containers. This will make it easy to spin up and down instances of the servers we will need.

### 2. Run docker-compose build
```
docker-compose -f docker-compose-redisFF.yml build
```
We will run this command to build an image for our checkbox container. This will also pull images (ex. nginx, redis, mongodb) from dockerhub if we do not have them locally.

### 3. Run docker-compose up
```
docker-compose -f docker-compose-redisFF.yml up -d
```
This will spin up all of our containers. The -d flag means the containers will run in the background.

### 4. Toggle on/off createStudy feature
```
docker exec -it redismaster redis-cli
```
Running this command will start the redis-cli within the redismaster container. We can now execute commands in the redis-cli.
We can now set the value for createStudy.

```
set createStudy true
```

or

```
set createStudy false
```

### 5. Checking value on slave
```
docker exec -it redisslave redis-cli
```
Running this command will start the redis-cli within the redisslave container.
We can view the value of createStudy.
```
get createStudy
```
It will mirror the value set in the master database.

## Screenshots  

#### Redis Feature Flag  

![](../tutorial-material/Redis-feature-flag.gif)
