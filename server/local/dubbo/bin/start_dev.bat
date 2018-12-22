setlocal 

set name="erp-service"
set port=8984
set jarfile=erp-service.jar

 
start %name% /MIN java -Dzkserver="127.0.0.1:2181"  -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=%port% -jar "%cd%\..\%jarfile%"

endlocal









