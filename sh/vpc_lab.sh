#!/usr/bin/env bash

############################
#npm instal
############################
cd /www/site/com.lab/qmx
npm install --unsafe-perm
npm run prod

############################
#openresty和uwsgi相关
############################
#环境启动程序
openresty -t;
service openresty start;

############################
# pip install
############################
cd /www/site/com.lab/qmx

apt-get install python3-pip
pip3 install -r requirements.txt

############################
# uwsgi
############################
cd /www/site/com.lab/qmx
if [[ ! -L /etc/uwsgi-emperor/vassals/flask_index.ini ]] && [[ ! -f /etc/uwsgi-emperor/vassals/flask_index.ini ]];then
    ln -s /www/site/com.lab/qmx/uwsgi/vpc_lab/flask_index.ini  /etc/uwsgi-emperor/vassals/flask_index.ini
fi;

service uwsgi-emperor stop
service uwsgi-emperor start
sleep 2
service uwsgi-emperor status

############################
#给予download文件夹全部权限
############################
cd /www/site/com.lab/qmx
chmod -R 777 download

echo "Success"