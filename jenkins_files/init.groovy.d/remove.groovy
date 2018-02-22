def groovySource = new File('/var/lib/jenkins/init.groovy.d/makeCred.groovy')
//println groovySource.text
//println "cred:"+cred
groovySource.text= groovySource.text.replaceAll('(addPassword\\()(\\w+)(,)(.*)(\\))','$1\'githubuser\'$3\'githubpwd\'$5')
//println groovySource.text
