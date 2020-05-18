# FitF

## Development setup

```sh
yarn install
yarn start
```

## Production setup

### Azure AppService

```sh
# package application
yarn install --production
zip -qr deploy.zip ./build ./dist ./node_modules

# update infrastructure
export TF_VAR_name="fitf"
export TF_VAR_subscription_id="5990203f-f212-4e0f-a0dd-1e57b4e10b66"
terraform init ./infrastructure
terraform apply -var code_zip=deploy.zip ./infrastructure
```

### Azure VM

1. Create VM with Managed Identity
2. Create Storage Account
3. Assign Storage Blob Data Contributor permissions to VM
4. Set up VM with script below

```txt
[host] ssh clewolff@fitf.justamouse.com
[ vm ] sudo apt-get update
[ vm ] sudo apt-get upgrade -y
[ vm ] curl -sL https://deb.nodesource.com/setup_12.x | sudo bash
[ vm ] curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
[ vm ] echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
[ vm ] sudo add-apt-repository -y ppa:certbot/certbot
[ vm ] sudo apt-get update
[ vm ] sudo apt-get install -y nodejs yarn libcap2-bin certbot
[ vm ] sudo certbot certonly
[ vm ] echo "0 0 1,15 * * certbot renew 2>&1 | /usr/bin/logger -t update_letsencrypt_renewal" | sudo crontab
[ vm ] echo "30 0 1,15 * * pm2 restart 0 2>&1 | /usr/bin/logger -t update_letsencrypt_renewal" | crontab
[ vm ] sudo chmod 0755 /etc/letsencrypt/{live,archive}
[ vm ] sudo setcap cap_net_bind_service=+ep /usr/bin/node
[ vm ] mkdir -p fitf/git
[ vm ] cd fitf/git && git init --bare && cd -
[ vm ] cd fitf && git clone ./git ./code && cd ./code
[host] git remote add vm ssh://clewolff@fitf.justamouse.com:/home/clewolff/fitf/git
[host] git push vm master
[ vm ] git pull
[ vm ] echo "PORT=443" >> .env
[ vm ] echo "SECONDARY_PORT=80" >> .env
[ vm ] echo "HTTPS=true" >> .env
[ vm ] echo "SSL_CRT_FILE=/etc/letsencrypt/live/fitf.justamouse.com/fullchain.pem" >> .env
[ vm ] echo "SSL_KEY_FILE=/etc/letsencrypt/live/fitf.justamouse.com/privkey.pem" >> .env
[ vm ] echo "AZURE_STORAGE_ACCOUNT=fitf" >> .env
[ vm ] echo "AZURE_STORAGE_CONTAINER=fitf" >> .env
[ vm ] yarn install
[ vm ] yarn run build
[ vm ] sudo npm install -g pm2@latest
[ vm ] pm2 start dist/backend/server.js
[ vm ] pm2 monit
```
