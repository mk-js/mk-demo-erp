
echo stop $(date)
cd scripts
sh stop.sh
cd ..

echo build $(date)
cd ../../src/java 
mvn clean
mvn clean package install -Dmaven.test.skip=true    
  
echo copy  $(date)
cd ../../../server/

rm -rf  dubbox/*.jar
rm -rf  dubbox/logs/*.log
rm -rf  dubbox/lib/*
rm -rf  dubbox/js/*

cp ../../src/service/java/erp-service/target/*.jar dubbo/ 
cp ../../src/service/java/erp-service/target/lib/*.* dubbo/lib/ 
cp -rf ../../src/js/* dubbo/js/

rm -rf  nodejs/html/*  
cp ../../src/web/build/pkg/* nodejs/html/ 

echo run  $(date)
cd scripts
sh run.sh
cd ..
 
