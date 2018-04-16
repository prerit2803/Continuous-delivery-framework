#!/bin/bash

jenkins_port=`python ymlparse.py 'jenkins_port'`
JOB_URL=http://localhost:${jenkins_port}/job/itrust-build
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
curl 'http://localhost:${jenkins_port}/git/notifyCommit?url=/var/lib/jenkins/checkbox.io.git'""" >> post-receive

sudo chmod 777 post-receive
sudo mv post-receive /var/lib/jenkins/checkbox.io.git/hooks

cd /var/lib/jenkins/checkbox.io

sudo git remote add prod "/var/lib/jenkins/checkbox.io.git"

sudo rm README.md
sudo touch README.md
sudo git add README.md
sudo git commit -m 'test'
sudo git push prod master

sleep 30

sudo rm -rf /var/lib/jenkins/checkbox.io 
sudo rm -rf /var/lib/jenkins/checkbox.io.git

popd