cd ..
call zookeeper\bin\zkServer.cmd 

cd dubbo\bin
call start_dev.bat
cd ..\..\

timeout /t 35 

cd nodejs\
call startup.bat
cd ..\
