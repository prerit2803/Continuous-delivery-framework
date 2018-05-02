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

ADMINUSER=`python ymlparse.py 'GERRIT_ADMIN_USER'`
ADMINPASS=`python ymlparse.py 'GERRIT_ADMIN_PASSWORD'`
USERUSER=`python ymlparse.py 'GERRIT_USER_USER'`
USERPASS=`python ymlparse.py 'GERRIT_USER_PASSWORD'`
USEREMAIL=`python ymlparse.py 'GERRIT_USER_EMAIL'`
GERRIT_PORT=`python ymlparse.py 'gerrit_port'`
GITUSER=`python ymlparse.py 'GIT_USER'`
GITPASS=`python ymlparse.py 'GIT_PASSWORD'`

rm ymlparse.py

pushd .
cd ~

# checkbox.io gerrit setup
rm -rf checkbox.io
git clone https://github.com/chrisparnin/checkbox.io.git

cd checkbox.io

curl -XPUT http://localhost:${GERRIT_PORT}/a/projects/checkbox.io \
--digest \
-u ${ADMINUSER}:${ADMINPASS} \
-H 'Content-Type: application/json; charset=UTF-8' \
-d '{"description":"checkbox!"}' -vv

curl -XPUT http://localhost:${GERRIT_PORT}/a/projects/checkbox.io/config \
--digest \
-u ${ADMINUSER}:${ADMINPASS} \
-H 'Content-Type: application/json; charset=UTF-8' \
-d '{"description":"checkbox!", "require_change_id": "FALSE"}'

# upload initial checkbox repo
git remote remove gerrit_admin
git remote add gerrit_admin http://${ADMINUSER}:${ADMINPASS}@localhost:${GERRIT_PORT}/checkbox.io
git push gerrit_admin master:refs/heads/master

cd ..
rm -rf checkbox.io
cd ~

# iTrust gerrit setup
rm -rf iTrust2-v2
git clone https://${GITUSER}:${GITPASS}@github.ncsu.edu/pbhanda2/iTrust2-v2.git

cd iTrust2-v2

curl -XPUT http://localhost:${GERRIT_PORT}/a/projects/iTrust2-v2 \
--digest \
-u ${ADMINUSER}:${ADMINPASS} \
-H 'Content-Type: application/json; charset=UTF-8' \
-d '{"description":"iTrust!"}' \

curl -XPUT http://localhost:${GERRIT_PORT}/a/projects/iTrust2-v2/config \
--digest \
-u ${ADMINUSER}:${ADMINPASS} \
-H 'Content-Type: application/json; charset=UTF-8' \
-d '{"description":"iTrust!", "require_change_id": "FALSE"}'

# upload initial itrust repo
git remote remove gerrit_admin
git remote add gerrit_admin http://${ADMINUSER}:${ADMINPASS}@localhost:${GERRIT_PORT}/iTrust2-v2
git push gerrit_admin master:refs/heads/master

cd ..
rm -rf iTrust2-v2

popd
exit