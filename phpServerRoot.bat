@echo off
setlocal 

start php -S localhost:8000 -t %~dp0
 