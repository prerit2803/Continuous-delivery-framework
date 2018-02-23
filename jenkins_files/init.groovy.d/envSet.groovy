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

envVars.put("MYSQL_PASSWORD","ENTER_HERE_MYSQL_PASSWORD" )
envVars.put("AWS_ACCESS_KEY_ID","ENTER_HERE_AWS_ACCESS_KEY_ID" )
envVars.put("AWS_SECRET_ACCESS_KEY","ENTER_HERE_AWS_SECRET_ACCESS_KEY" )
envVars.put("GIT_USER","ENTER_HERE_GIT_USER" )
envVars.put("GIT_PASSWORD","ENTER_HERE_GIT_PASSWORD" )
envVars.put("MONGO_PORT","ENTER_HERE_MONGO_PORT" )
envVars.put("MONGO_IP","ENTER_HERE_MONGO_IP" )
envVars.put("MONGO_USER","ENTER_HERE_MONGO_USER" )
envVars.put("MONGO_PASSWORD","ENTER_HERE_MONGO_PASSWORD" )
envVars.put("MAIL_USER","ENTER_HERE_MAIL_USER" )
envVars.put("MAIL_PASSWORD","ENTER_HERE_MAIL_PASSWORD" )
envVars.put("MAIL_SMTP","ENTER_HERE_MAIL_SMTP" )

instance.save();
