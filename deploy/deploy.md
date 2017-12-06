# How to deploy a production machine
## Setup a virtual machine
  1. Create a Ubuntu 16.04 VM
  2. Allow 80, 8080 inbound port for web request
  3. Allow 443, 587 inbound port for email service
  4. Allow 27017 inbound port for mongodb

## Setup neccessary dependencies
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

  6. Setup MongoDB

  <TODO>












