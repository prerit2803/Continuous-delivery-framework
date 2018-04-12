import jenkins.*
import jenkins.model.*
import jenkins.install.InstallState.*
import hudson.*
import hudson.model.*
import hudson.security.*

def cli= CLI.get()
def instance= Jenkins.get()

// Enable CLI
cli.setEnabled(true)

// Disable Jenkins security
instance.disableSecurity()

// Set SlaveAgentPort -> 4000
instance.setSlaveAgentPort(4000)
Set enProtocols= ["JNLP4-connect"]
instance.setAgentProtocols(enProtocols)

// Jenkins InstallState -> RUNNING
def iState= jenkins.install.InstallState
instance.setInstallState(iState.RUNNING)

// Save settings
instance.save()
