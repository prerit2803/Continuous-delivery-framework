#!/bin/bash

jenkins_port=`python ymlparse.py 'jenkins_port'`
JOB_URL=http://localhost:`echo $jenkins_port`/job/itrust-build
JOB_STATUS_URL=${JOB_URL}/lastBuild/api/json
GREP_RETURN_CODE=0

git config --global user.email "you@example.com"
git config --global user.name "Your Name"


pushd .

cd /var/lib/jenkins

sudo git clone https://github.com/chrisparnin/checkbox.io.git

sudo mkdir checkbox.io.git
cd checkbox.io.git
sudo git init --bare

cd $HOME
echo """#!/bin/bash
curl 'http://localhost:`echo $jenkins_port`/git/notifyCommit?url=/var/lib/jenkins/checkbox.io.git'""" >> post-receive

sudo chmod 777 post-receive
sudo mv post-receive /var/lib/jenkins/checkbox.io.git/hooks

cd /var/lib/jenkins/checkbox.io

sudo git remote add prod "/var/lib/jenkins/checkbox.io.git"

sudo touch README.md
sudo git add README.md
sudo git commit -m 'test'
sudo git push prod master

JOB_URL=http://localhost:8080/job/checkbox-build
JOB_STATUS_URL=${JOB_URL}/lastBuild/api/json
GREP_RETURN_CODE=0

# Poll every couple of seconds until the build is finished
while [ $GREP_RETURN_CODE -eq 0 ]
do
    sleep 10
    # Grep will return 0 while the build is running:
    curl --silent $JOB_STATUS_URL | grep result\":null > /dev/null
    GREP_RETURN_CODE=$?
done
# from https://serverfault.com/questions/309848/how-to-check-the-build-status-of-a-jenkins-build-from-the-command-line

sudo rm -rf /var/lib/jenkins/checkbox.io 
sudo rm -rf /var/lib/jenkins/checkbox.io.git

popd