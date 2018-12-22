echo sh zookeeper/bin/zkServer.sh stop 
ps -A|grep erp-service.jar|awk '{print $1}'|xargs kill -9 
ps -A|grep "node index.js"|awk '{print $1}'|xargs kill -9 
