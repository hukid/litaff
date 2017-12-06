/* eslint-disable */
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // litaff for production
    {
      name      : 'litaff',
      script    : 'server',
      env: {
        MAIL_KEY: '',
        PORT: 3000,
      },
      env_production : {
        NODE_ENV: 'production',
      },
      env_dev : {
        NODE_ENV: 'development',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'hukid',
      host : '13.75.92.114',
      ref  : 'origin/master',
      repo : 'https://github.com/hukid/litaff.git',
      path : '/home/hukid/litaff/production',
      "pre-deploy-local" : "echo 'copy local deploy/ecosystem.prod.config.js to server' && scp deploy/ecosystem.prod.config.js hukid@13.75.92.114:'/home/hukid/litaff/production' ",
      // TODO: Fix build error with DateRange
      //'post-deploy' : 'npm install && npm run build && pm2 reload /home/hukid/litaff/production/ecosystem.prod.config.js --env production && rm /home/hukid/litaff/production/ecosystem.prod.config.js'
      'post-deploy' : 'npm install && npm run build; pm2 reload /home/hukid/litaff/production/ecosystem.prod.config.js --env production && rm /home/hukid/litaff/production/ecosystem.prod.config.js'
    },
    development : {
      user : 'hukid',
      host : '13.75.92.114',
      ref  : 'origin/master',
      repo : 'https://github.com/hukid/litaff.git',
      path : '/home/hukid/litaff/development',
      "pre-deploy-local" : "echo 'copy local deploy/ecosystem.prod.config.js to server' && scp  deploy/ecosystem.prod.config.js hukid@13.75.92.114:'/home/hukid/litaff/development' ",
      'post-deploy' : 'npm install && pm2 reload /home/hukid/litaff/development/ecosystem.prod.config.js --env dev && rm /home/hukid/litaff/development/ecosystem.prod.config.js'
    }
  }
};
