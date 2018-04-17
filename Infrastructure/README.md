# Infrastructure Upgrade

## Demos
[Redis Feature Flag](https://youtu.be/EVDjo-KJ-40)

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
We have created a Kubernets cluster of 3 nodes with 1 master and 2 slaves on AWS.  
The kubernets maintains a Checkbox containers i.e. Checkbox pod running on the network at all times. So as long as one of the slaves is working on the cluster, the kubernetes master can keep he service up without the external user realizing about the slave failures. Diagram below explains the concept.

![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone3/tutorial-material/k8s.png)


