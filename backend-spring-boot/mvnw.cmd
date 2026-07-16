@echo off
setlocal
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
if not exist "%JAVA_HOME%\bin\java.exe" (
    set "JAVA_HOME=c:\Users\SREE\.antigravity-ide\extensions\redhat.java-1.55.0-win32-x64\jre\21.0.11-win32-x86_64"
)
"%~dp0.maven\apache-maven-3.9.6\bin\mvn.cmd" %*
