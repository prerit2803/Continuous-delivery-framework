Make sure you have your gerrit / git creds set up in the repo
```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```


Make a commit...

```
date +%s > README.md

git add README
git commit -m 'This is a test!'
```


Add gerrit as a remote w/ your creds. Push to that remote with HEAD:refs/for/master

```
git remote add gerrit_user http://${USERUSER}:${USERPASS}@${GERRIT_URL}:${GERRIT_PORT}/checkbox.io
git push gerrit_user HEAD:refs/for/master
```

Now your change is up for review in gerrit!