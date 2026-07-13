@echo off
setlocal
if not defined JAVA_HOME (
    set "JAVA_HOME=c:\Users\SREE\.antigravity-ide\extensions\redhat.java-1.55.0-win32-x64\jre\21.0.11-win32-x86_64"
)
"%~dp0.maven\apache-maven-3.9.6\bin\mvn.cmd" %*
