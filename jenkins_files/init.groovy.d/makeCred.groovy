import jenkins.model.*
import com.cloudbees.plugins.credentials.CredentialsScope
import com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl
import jenkins.*
import jenkins.install.InstallState.*
import hudson.*
import hudson.model.*
import hudson.security.*
import hudson.slaves.EnvironmentVariablesNodeProperty

def instance= Jenkins.get()

def addPassword = { username, new_password ->
    def creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
        com.cloudbees.plugins.credentials.common.StandardUsernameCredentials.class,
        Jenkins.instance
    )

    def c = creds.findResult { it.username == username ? it : null }

    if ( c ) {
        println "found credential ${c.id} for username ${c.username}"
    } else {
        def credentials_store = Jenkins.instance.getExtensionList(
            'com.cloudbees.plugins.credentials.SystemCredentialsProvider'
            )[0].getStore()

        def scope = CredentialsScope.GLOBAL

        def description = ""

        def result = credentials_store.addCredentials(
            com.cloudbees.plugins.credentials.domains.Domain.global(),
            new UsernamePasswordCredentialsImpl(scope, null, description, username, new_password)
            )

        if (result) {
            println "credential added for ${username}"
        } else {
            println "failed to add credential for ${username}"
        }
    }
}

addPassword('githubuser','githubpwd')


def creds = com.cloudbees.plugins.credentials.CredentialsProvider.lookupCredentials(
      com.cloudbees.plugins.credentials.common.StandardUsernameCredentials.class,
      Jenkins.instance,
      null,
      null
  );
for (c in creds) {
println(c.id + ": " + c.description)
//Set environment variables

globalNodeProperties = instance.getGlobalNodeProperties()
envVarsNodePropertyList = globalNodeProperties.getAll(EnvironmentVariablesNodeProperty.class)

newEnvVarsNodeProperty = null
envVars = null

if ( envVarsNodePropertyList == null || envVarsNodePropertyList.size() == 0 ) {
  newEnvVarsNodeProperty = new EnvironmentVariablesNodeProperty();
  globalNodeProperties.add(newEnvVarsNodeProperty)
  envVars = newEnvVarsNodeProperty.getEnvVars()
} else {
  envVars = envVarsNodePropertyList.get(0).getEnvVars()
}

// Setting necessary environment varibales for build and deployment of iTrust and Checkbox.io
envVars.put("GIT_CREDID",c.id )

def source = new File('/var/lib/jenkins/project_repo/jenkins_files/itrust.yml')
//println source.text
def cred= envVars.get('GIT_CREDID')
//println "cred:"+cred
source.text= source.text.replaceAll('gitCredId',cred)
//println source.text




}
