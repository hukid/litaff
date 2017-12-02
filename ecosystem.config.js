module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'litaff',
      script    : 'server',
      env: {
        MAIL_KEY: '',
      },
      env_production : {
        NODE_ENV: 'production'
      },
      env_staging : {
        NODE_ENV: 'production',
      }
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
      "pre-deploy-local" : "echo 'copy local ecosystem.config.js to server' && scp ecosystem.config.js hukid@13.75.92.114:'/home/hukid/litaff/production' ",
      // TODO: Fix build error with DateRange
      //'post-deploy' : 'npm install && npm run build && pm2 reload /home/hukid/litaff/production/ecosystem.config.js --env production && rm /home/hukid/litaff/production/ecosystem.config.js'
      'post-deploy' : 'npm install && npm run build; pm2 reload /home/hukid/litaff/production/ecosystem.config.js --env production && rm /home/hukid/litaff/production/ecosystem.config.js'
    },
    staging : {
      user : 'hukid',
      host : '13.75.92.114',
      ref  : 'origin/master',
      repo : 'https://github.com/hukid/litaff.git',
      path : '/home/hukid/litaff/staging',
      "pre-deploy-local" : "echo 'copy local ecosystem.config.js to server' && scp ecosystem.config.js hukid@13.75.92.114:'/home/hukid/litaff/staging' ",
      // TODO: Fix build error with DateRange
      //'post-deploy' : 'npm install && npm run build && pm2 reload /home/hukid/litaff/staging/ecosystem.config.js --env staging && rm /home/hukid/litaff/staging/ecosystem.config.js'
      'post-deploy' : 'npm install && npm run build; pm2 reload /home/hukid/litaff/staging/ecosystem.config.js --env staging && rm /home/hukid/litaff/staging/ecosystem.config.js'
    }
  }
};
