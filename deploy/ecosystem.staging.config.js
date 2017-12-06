/* eslint-disable */
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // litaff for production
    {
      name      : 'litaff-staging',
      script    : 'server',
      env: {
        MAIL_KEY: '',
        PORT: 3001,
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
      path : '/home/hukid/litaff-staging/production',
      "pre-deploy-local" : "echo 'copy local deploy/ecosystem.staging.config.js to server' && scp deploy/ecosystem.staging.config.js hukid@13.75.92.114:'/home/hukid/litaff-staging/production' ",
      // TODO: Fix build error with DateRange
      //'post-deploy' : 'npm install && npm run build && pm2 reload /home/hukid/litaff/production/ecosystem.staging.config.js --env production && rm /home/hukid/litaff/production/ecosystem.staging.config.js'
      'post-deploy' : 'npm install && npm run build; pm2 reload /home/hukid/litaff-staging/production/ecosystem.staging.config.js --env production && rm /home/hukid/litaff-staging/production/ecosystem.staging.config.js'
    },
    development : {
      user : 'hukid',
      host : '13.75.92.114',
      ref  : 'origin/master',
      repo : 'https://github.com/hukid/litaff.git',
      path : '/home/hukid/litaff-staging/development',
      "pre-deploy-local" : "echo 'copy local deploy/ecosystem.staging.config.js to server' && scp  deploy/ecosystem.staging.config.js hukid@13.75.92.114:'/home/hukid/litaff-staging/development' ",
      'post-deploy' : 'npm install && pm2 reload /home/hukid/litaff-staging/development/ecosystem.staging.config.js --env dev && rm /home/hukid/litaff-staging/development/ecosystem.staging.config.js'
    }
  }
};
