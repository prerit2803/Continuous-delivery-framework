// Removing Git Credentials from makeCred
def groovySource = new File('/var/lib/jenkins/init.groovy.d/makeCred.groovy')
groovySource.text= groovySource.text.replaceAll('(addPassword\\()(\\w+)(,)(.*)(\\))','$1\'githubuser\'$3\'githubpwd\'$5')
