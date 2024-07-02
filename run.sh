cd docker
./build.sh

cd ..

docker run -it --rm \
	--name spottube-server --net host --ipc host --privileged \
	-v $(pwd):/home/spottube \
	-w /home/spottube \
	spottube:base bash -c "cd server && chmod +x run_server.sh && ./run_server.sh"







