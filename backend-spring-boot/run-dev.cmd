@echo off
REM Launch wrapper for the ReeVibes Spring Boot backend.
REM Sets JAVA_HOME (not defined globally on this machine) then runs the Maven wrapper.
setlocal
if "%JAVA_HOME%"=="" set "JAVA_HOME=C:\Program Files\Java\jdk-17"
cd /d "%~dp0"
call "%~dp0mvnw.cmd" spring-boot:run
