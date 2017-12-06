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
        PORT: 3000,

        // configure MAIL_KEY that send grid can authorize, you need get MAIL_KEY from sendgrid
        MAIL_KEY: '[TO BE UPDATE]',

        // configure JWT_KEY so that the token can be encrypted
        JWT_KEY: '[TO BE UPDATE]',
      },
      env_production : {
        NODE_ENV: 'production',
        // configure the database connection string
        // localhost: mongodb://localhost:27017/litaff
        DB_CONNECT: 'mongodb://[username]:[password]@[TO BE UPDATE]:27017/litaff',
      },
      env_dev : {
        NODE_ENV: 'development',
        DB_CONNECT: 'mongodb://localhost:27017/litaff'
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      // configure the remote server
      // key : '/path/to/some.pem' // authenticate to remote server
      user : '[TO BE UPDATE]',
      host : '[TO BE UPDATE]',
      ref  : 'origin/master',
      repo : 'https://github.com/hukid/litaff.git',
      path : '/home/hukid/litaff/production',
      "pre-deploy-local" : "echo 'copy local deploy/ecosystem.prod.config.js to server' && scp deploy/ecosystem.prod.config.js hukid@13.75.92.114:'/home/hukid/litaff/production' ",
      // TODO: Fix build error with DateRange
      //'post-deploy' : 'npm install && npm run build && pm2 reload /home/hukid/litaff/production/ecosystem.prod.config.js --env production && rm /home/hukid/litaff/production/ecosystem.prod.config.js'
      'post-deploy' : 'npm install && npm run build; pm2 reload /home/hukid/litaff/production/ecosystem.prod.config.js --env production && rm /home/hukid/litaff/production/ecosystem.prod.config.js'
    },
  }
};
