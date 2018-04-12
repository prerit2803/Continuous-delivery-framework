# python script to parse vars.yml and get value given key
# used to get GIT_USER, GIT_PASSWORD, jenkins_port in pipeline_tester scripts
echo """
import yaml
import sys

data = ''
with open('./group_vars/all/vars.yml', 'r') as stream:
    try:
        data = yaml.load(stream)
    except:
        print('yaml machine broke')

print data['env_vars'][sys.argv[1]]
""" >> ymlparse.py

/bin/bash ./pipeline_test_scripts/iTrust_pipeline_tester.sh
#/bin/bash ./pipeline_test_scripts/chekcbox_pipeline_tester.sh

rm ymlparse.py