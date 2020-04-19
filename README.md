# FitF

## Development setup

```sh
yarn install
yarn start
```

## Production setup

```txt
[host] ssh clewolff@fitf.justamouse.com
[ vm ] sudo apt-get update
[ vm ] sudo apt-get upgrade -y
[ vm ] curl -sL https://deb.nodesource.com/setup_12.x | sudo bash
[ vm ] curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
[ vm ] echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
[ vm ] sudo apt-get update
[ vm ] sudo apt-get install -y nodejs yarn libcap2-bin
[ vm ] sudo setcap cap_net_bind_service=+ep /usr/bin/node
[ vm ] mkdir -p fitf/git
[ vm ] cd fitf/git && git init --bare && cd -
[ vm ] cd fitf && git clone ./git ./code
[host] git remote add vm ssh://clewolff@fitf.justamouse.com:/home/clewolff/fitf/git
[host] git push vm master
[ vm ] git pull
[ vm ] export REACT_APP_SERVER_URL=http://fitf.justamouse.com
[ vm ] export SERVER_PORT=80
[ vm ] yarn install
[ vm ] yarn run build
[ vm ] sudo npm install -g pm2@latest
[ vm ] pm2 start dist/backend/server.js
[ vm ] pm2 monit
```
