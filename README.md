# CSC519-Project

## Team Members:
+ Zachery Thomas (zithomas)
+ Vikas Pandey (vrpandey)
+ Prerit Bhandari (pbhanda2)
+ Ankur Saxena (asaxena3)

## Overview
For the Miestone1 of the project, we are provisioning Amazon Web Services EC2 instances for our jenkins server, and deploying _Checkbox.io_ and _iTrust2_. 
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
### Setting variables
We first set variable values in `group/all/vars.yml`  
![](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone1/tutorial_material/vault.PNG).  
You must edit following variables (don't provide blank values to any variable):  

+ `mysql_password`: MySQL admin password  
+ `ACCESS_KEY`: Secret access key for AWS account  
+ `SECRET_KEY`: Secret key for AWS account  
+ `GIT_USER`: NCSU Github account username  
+ `GIT_PASSWORD`: NCSU Github acccount password  
+ `MONGODB_IP`: localhost   //Setting to any other value will not guarantee a success  
+ `MONGODB_USER`: Username to set for Mongodb  
+ `MONGODB_PASS`: Password for Mongodb username  
+ `MONGODB_MAIL_USER`: Email for Mongodb  
+ `MONGODB_MAIL_PASSWORD`: Password for Mongodb email  
+ `MONGODB_MAIL_SMTP`: SMTP for Mongodb  
Besides these values, the `MONGODB_PORT` is being set to **3002** as instructed.  

### Running the playbook

To run the playbook, you need to install **ansible** to your local machine. Then use the following command to run the playbook:
```
ansible-playbook -i build-inventory build.yml
```

## Challenges
### Automate Host-Checking for AWS server
The project tasks us to provision a new server and automatically ssh into it and run tasks. But the major challenge in this was to automate the HostChecking that ssh does to verify the newly provisioned instance. We overcame this challenge by using the following method:
#### 1. Install awscli to enable running CLI on localhost for AWS
```
- name: Install awscli
  become: yes
  apt:
    name: awscli
    state: present
    update_cache: yes
```
#### 2. Fetch the ECDSA RSA256 public key of the newly created AWS instance
The ssh always requests the public key of the server to verify it's identity and adds it to the list of known hosts. We tried using `ssh_keyscan` but the public key retrieved by the command didn't work. So we ran the awscli command to describe instance and parse out the key using `sed`. Retries are added to wait until SSH is up on the instance.
```
- name: Get public key of EC2 instance
  shell: aws ec2 get-console-output \
          --region us-east-2 \
          --instance-id "{{aws.instances[0].id}}" \
          --output text|sed -n 's/^.*\(ecdsa-sha2-nistp256 \)\(.*\)/\2/p' | awk '{print $1}'
  register: key_results
  retries: 100
  until: key_results.stdout != ''
```
#### 3. Add key to `$HOME/.ssh/known_hosts`
Finally the value of key was stored into the known_host file along with the ip address.
```
- name: Register public key to known_hosts
  lineinfile:
    name: "{{ ansible_env.HOME }}/.ssh/known_hosts"
    create: yes
    line: "{{ aws.instances[0].public_ip }} ecdsa-sha2-nistp256 {{key_results.stdout}}"
    insertafter: EOF
    state: present
```
Using this method, we could now access the EC2 instance we created without being prompted by HostKeyCheck.

### Automate inventory update after server provisioning
After the host key was added to the server, we needed to update our inventory so that ansible could access the newly created host. We acheived that by following method  
#### 1. Update inventory file with the new host details
The inventory was updated by adding the _host_ip, ansible_ssh_user, _ansible_ssh_private_key_file_ in the inventory in proper group. 
```
- name: Update inventory
  lineinfile:
    path: ./build-inventory
    insertafter: 'jenkins'
    line: "{{aws.instances[0].public_ip}} ansible_ssh_user=ubuntu ansible_ssh_private_key_file=~/jenkins-key.pem"
    state: present
```
#### 2. Update in-memory inventory of Anisble
We used a meta command to refresh the state of ansible's in-memory inventory.
```
- meta: refresh_inventory
```
Using this method, we were able to automate the process of accessing the newly provisioned server.
### Automate Jenkins installation
Once, we created the Jenkins server, we needed to automate the installation process of Jenkins. This was the trickiest part of the Milestone which we did in the following manner:
#### 1. Disabling Jenkins' installation wizard
We passed one more argument `-Djenkins.install.runSetupWizard=false` to $JAVA_ARGS in `/etc/default/jenkins` file to disable the self started setup wizard for Jenkins.
```
- name: Disable Jenkins' initial authorization wizard
  become: yes
  replace:
    path: /etc/default/jenkins
    regexp: -Djava.awt.headless=true
    replace: -Djava.awt.headless=true -Djenkins.install.runSetupWizard=false
```
#### 2. Configuring Jenkins through groovy
We placed an [init.groovy](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone1/jenkins_files/init.groovy.d/init.groovy) script to set desired values for the Jenkins state.
This included, 
    ++ Setting Jenkins' [installState to RUNNING](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/a8857fb4bc701349e7a0bf9124b5a677a9b822a7/jenkins_files/init.groovy.d/init.groovy#L24).
    ++ [Enabling CLI](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/a8857fb4bc701349e7a0bf9124b5a677a9b822a7/jenkins_files/init.groovy.d/init.groovy#L12)
    ++ [Disabling security](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/a8857fb4bc701349e7a0bf9124b5a677a9b822a7/jenkins_files/init.groovy.d/init.groovy#L15): This was necessary to automate jenkins setup process.
 #### 3. Configuring plugins
 Installing the required plugins for Jenkins
 ```
 - name: Install plugins for Jenkins
  jenkins_plugin:
    name: "{{item}}"
    with_dependencies: yes
  with_items:
    - git
    - postbuild-task
    - envinject
    - ansible
 ```
 #### 4. Restart Jenkins to enable setting
 Jenkins' runs the init.groovy upon restart and configure the Jenkins state to **RUNNING** which is ready to be accessed through UI
 ```
 - name: Restart Jenkins again to ready plugins
  become: yes
  service:
    name: jenkins
    state: restarted
 ```
### Injecting environment variables into Jenkins

### Creating git credentials for Jenkins SCM

### Running post-build jobs without sudo access

### Setting up Ansible Vault to store credentials securely

### User setup in MySQL and MongoDB Databases

