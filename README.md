# CSC519-Project

![SEE YOU SPACE COWBOY](https://img.youtube.com/vi/yg7V67ptg18/0.jpg)

## Team Members:
| Name | UnityId |
|--------------|-------|
| Zachery Thomas | zithomas |
| Vikas Pandey | vrpandey |
| Prerit Bhandari | pbhanda2 |
| Ankur Saxena | asaxena3 |

## Screencast
The screencast for the Milestone is [here](https://youtu.be/yg7V67ptg18)
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
    |-- all
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
+ `MONGODB_IP`: localhost   //Setting to any other value will not guarantee that checkbox will function properly
+ `MONGODB_USER`: Username to set for Mongodb  
+ `MONGODB_PASS`: Password for Mongodb username  
+ `MONGODB_MAIL_USER`: User for SMTP  
+ `MONGODB_MAIL_PASSWORD`: Password for SMTP  
+ `MONGODB_MAIL_SMTP`: SMTP for mail  
Besides these values, the `MONGODB_PORT` is being set to **3002** as instructed.  
### Guidelines
+ Make sure your AWS account doesn't have any key names _jenkins-key_, _checkbox-key_ or _itrust-key_. The playbook creates these keys and hence, if they already exist then the code won't work. Please delete any keys by these names from your AWS account before running the playbook.
### Running the playbook

To run the playbook, you need to install **ansible** to your local machine. Then use the following command to run the playbook:
```
ansible-playbook -i build-inventory build.yml
```
## Challenges
### #1 Automate Host-Checking for AWS server
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

### #2 Automate inventory update after server provisioning
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
### #3 Automate Jenkins installation
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
We placed an [init.groovy](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone1/jenkins_files/init.groovy.d/init.groovy) script in `$JENKINS_HOME/init.groovy.d/` to set desired values for the Jenkins state.
This included,    
+ [Setting Jenkins installState to RUNNING](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/a8857fb4bc701349e7a0bf9124b5a677a9b822a7/jenkins_files/init.groovy.d/init.groovy#L24)  
+ [Enabling CLI](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/a8857fb4bc701349e7a0bf9124b5a677a9b822a7/jenkins_files/init.groovy.d/init.groovy#L12)    
+ [Disabling security](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/a8857fb4bc701349e7a0bf9124b5a677a9b822a7/jenkins_files/init.groovy.d/init.groovy#L15): This was necessary to make changes to jenikns configuration without having created any user.
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
Jenkins runs the init.groovy upon restart. After restarting wait for the Jenkins web service to start responding to http requests again which means we can start uploading our jobs.
```
- name: Restart Jenkins again to ready plugins
  become: yes
  service:
    name: jenkins
    state: restarted
    
# Make sure Jenkins is ready to run after last restart
- name: Ensure Jenkins is up and running
  uri:
    url: http://localhost:8080
    status_code: 200
    timeout: 5
  register: jenkins_service_status
  # Keep trying for 5 mins in 5 sec intervals
  retries: 60
  delay: 5
  until: >
     'status' in jenkins_service_status and
     jenkins_service_status['status'] == 200
```

### #4 Injecting environment variables into Jenkins
Jenkins, by default can't access the variables of the host OS. So we need to separately inject environment variables into it's environment. We did this using the __Envinject__ plugin.
#### 1. Passing Environment Variable to job.yml file
The jenkins-job-builder needs a .yml file to build it's job. We inject our environment variables into our job fles as shown in the sample snippet: 
```
- inject-passwords:
    global: true
    mask-password-params: true
    job-passwords:
        - name: AWS_ACCESS_KEY_ID
          password: ENTER_HERE_AWS_ACCESS_KEY_ID
```
Job files are located here, [Checkbox.io](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/43a237e59da65bbe84315da93dc84667a11a3f04/jenkins_files/checkbox.yml) and [iTrust2](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/43a237e59da65bbe84315da93dc84667a11a3f04/jenkins_files/itrust.yml)   
The environment variables injected in this manner are saved to the jenkins' build envorinment and are hidden in the UI as well. 
#### 2. Substituting values to job.yml file
We created special keyword to be replaced through regex from ansible as in a sample snippet below
```
- name: Set AWS Access Key environment variable for iTrust Job
  vars:
    accessKey: "{{ env_vars.ACCESS_KEY }}"
  replace:
    path: /var/lib/jenkins/project_repo/jenkins_files/itrust.yml
    regexp: 'ENTER_HERE_AWS_ACCESS_KEY_ID'
    replace: "{{accessKey}}"
  become: yes
```
#### 3. Deleting the job.yml after job finishes
We delete the yml files after the job finishes. This maintains confidentiality of the keys since, they are nowhere to be found after the job finishes. And the config.xml for the job contains encrypted values which can't be stolen.
```
- name: Cleanup iTrust
  become: yes
  file:
    path: /var/lib/jenkins/project_repo/jenkins_files/itrust.yml
    state: absent
    mode: 0440

- name: Cleanup Checkbox.io
  become: yes
  file:
    path: /var/lib/jenkins/project_repo/jenkins_files/checkbox.yml
    state: absent
    mode: 0440
```
### #5 Creating git credentials for Jenkins SCM
Jenkins needs to clone repositories from git as part of the build step. The yml file needs a git credential associated with the username and password to access the github.ncsu.edu. 
#### 1. Creating Git Credentials
We create these credential through a groovy script [makeCred.groovy](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone1/jenkins_files/init.groovy.d/makeCred.groovy) 
+ This creates a new git credential from the username and password provided in the file( which are added to the file by ansible).
+ Once the jenkins restarts, the credential is setup in the Jenkins environment through the script.
#### 2. Setting credentials in groovy file
We set the credentials in the groovy file through ansible
```
- name: Set Git User name in Groovy script
  vars:
    gituser: "{{ env_vars.GIT_USER }}"
  replace:
    path: /var/lib/jenkins/init.groovy.d/makeCred.groovy
    regexp: 'githubuser'
    replace: "{{gituser}}"
  become: yes

- name: Set Git Password in Groovy script
  vars:
    gitpass: "{{ env_vars.GIT_PASSWORD }}"
  replace:
    path: /var/lib/jenkins/init.groovy.d/makeCred.groovy
    regexp: 'githubpwd'
    replace: "{{gitpass}}"
  become: yes
```
#### 3. Cleaning up Credentials
After setting up the environment, we replace the values of github username and password placed in the `makeCred.groovy` file through another file [remove.groovy](https://github.ncsu.edu/asaxena3/CSC519-Project/blob/Milestone1/jenkins_files/init.groovy.d/remove.groovy). This ensures confidentiality of the credentials.

### #6 Running post-build jobs without sudo access
The post build jobs are run as Jenkins users so we needed to make sure that all the jobs that were run in the localhost did not need privilege escalation to root user. 
+ We removed all the installation steps from the deployment playbook, since all of them need sudo access. 
+ Also, the git repository that we copied to `$JENKINS_HOME` was owned by root. Changing ownership to Jenkins made it work for us.
```
- name: Change Repo Permission to User Jenkins
  become: yes
  command: chown -hR jenkins:jenkins /var/lib/jenkins/project_repo
```
### #7 User setup in MySQL and MongoDB Databases
#### 1. MongoDB User Setup
For adding a user to MongoDB we used pyMongo and the mongod_user module. This made it fairly easy to set a MongoDB user by passing in our enviornment variables.

```ansible
- name: Install pyMongo
  become: yes
  pip:
    name: pyMongo
    state: present

- name: Add user to mongodb
  vars:
    - mongo_user:  "{{ lookup('env','MONGO_USER') }}"
    - mongo_password: "{{ lookup('env','MONGO_PASSWORD') }}"
  mongodb_user:
    database: admin
    name: "{{mongo_user}}"
    password: "{{mongo_password}}"
    state: present
    roles: dbAdmin,userAdminAnyDatabase,readWriteAnyDatabase
```
#### 2. MySQL
We first placed our mysql password in db.properties and hibernate.properties files.
Then we used the following command to build the database and create sample data.
```
mvn process-test-classes
```

## References
1. [Adding Git Credentials](https://github.com/jenkinsci/credentials-plugin/blob/master/src/main/java/com/cloudbees/plugins/credentials/CredentialsProvider.java)
2. [Setting Jenkins Environment Variables](http://javadoc.jenkins.io/hudson/slaves/EnvironmentVariablesNodeProperty.html)
3. [Jenkins Job Builder](https://docs.openstack.org/infra/jenkins-job-builder/)
4. [Jenkins CLI](https://wiki.jenkins.io/display/JENKINS/Jenkins+CLI)
