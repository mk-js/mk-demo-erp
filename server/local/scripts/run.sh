cd ..
sh zookeeper/bin/zkServer.sh start 

rm dubbo/bin/nohup.out
rm nodejs/nohup.out

cd dubbo/bin
sh start_dev.sh
cd ../../

sleep 45

cd nodejs
nohup sh startup.sh &
cd ../
