//exit
exit

//stop 
docker stop redis-cache

//start
docker start redis-cache

//remove
docker rm -f redis-cache

//REdis cli + keys *
 docker exec -it redis-cache redis-cli
 keys *  de xem cac key da luu
