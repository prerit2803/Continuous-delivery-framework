def groovySource = new File('/var/lib/jenkins/init.groovy.d/makeCred.groovy')
//println groovySource.text
//println "cred:"+cred
groovySource.text= groovySource.text.replaceAll('(addPassword\\(.*)(,)(.*)(\\))','$1$2\'githubpwd\'$4')
//println groovySource.text
