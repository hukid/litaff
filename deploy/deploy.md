# How to deploy a production machine


## Setup a virtual machine
  1. Create a Ubuntu 16.04 VM [with SSH key](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
  2. Allow 80, 8080 inbound port for web request
  3. Allow 443, 587 inbound port for email service

## Setup MongoDB, refer [here]( https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04) for more details (This can be setup separately)
  1. add this official mongodb repository to our server
        1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5`
        2. `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list`
        3. `sudo apt-get update`
  2. `sudo apt-get install -y mongodb-org`
  3. `sudo systemctl start mongod`
  4. `sudo systemctl status mongodb`
  5. `sudo systemctl enable mongodb`
  6. Setup db remote access
        1. `mongo`
        2. `use admin`
        3. create an admin:
            `db.createUser({ user: "admin", pwd: "[YourPassword]", roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })`
        4. create littaff user  
            `db.createUser({user: 'litaffUser', pwd: '[YourPassword]', roles: [{ role: 'readWrite', db:'litaff'}]})`
        5. edit mongod.conf  
                1. `sudo nano /etc/mongod.conf`  
                2. `bindIp: 0.0.0.0`  
                3. add following 
                 `security:  
                    authorization: 'enabled'`
        6. Allow **27017** inbound port for mongodb

## Setup neccessary dependencies for web app
  Steps 1-4 referenced by https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

  1. sudo apt-get update
  2. Install NodeJs with npm  
      `cd ~;`  
      `curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh;`  
      `sudo bash nodesource_setup.sh;`  
      `sudo apt-get install nodejs;`  

  3. Prepare for some packages that require compile  
      `sudo apt-get install build-essential`  

  4. Install PM2 and config auto startup on server reboots:  
      `sudo npm install -g pm2;`  
      `pm2 startup systemd;`  

  5. Set Up Nginx as a Reverse Proxy Server, refer to this [link](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)

      `sudo apt-get install nginx`  
      `sudo ufw status`  
      `sudo ufw disable`  
      make sure the service is running: `systemctl status nginx`, other wise: `sudo systemctl start nginx`  
      `sudo systemctl enable nginx`  
      `sudo nano /etc/nginx/sites-available/default`  
        Copy from /deploy/nginx.default.config and override the document  
      `sudo nginx -t`  
      `sudo systemctl restart nginx`  

## Deploy Web App

1. git clone litaff from github (https://github.com/hukid/litaff) to local machine
2. Install PM2 locally:  
    `sudo npm install -g pm2`
3. Update "ecosystem.prod.config.js" or "ecosystem.staging.config.js" in folder "deploy" locally, find all [UPDATE] and replace with meaningful value.
4. In litaff project root, execute:  
    `pm2 deploy deploy/ecosystem.prod.config.js production setup`  
    `pm2 deploy deploy/ecosystem.prod.config.js production`

## Deploy with new change

1. push your new change to orgin/master
2. re-run `pm2 deploy deploy/ecosystem.prod.config.js production`
3. test and if there is any broken, revert  
    `pm2 deploy deploy/ecosystem.prod.config.js revert [1 | nth previous]`



# Trouble shooting

## Mongodb cannot be start
    You may reinstalled mongodb, check if the db folder is empty, if not, clear it and try to start again









