const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./app');

// Setup work and export for the JWT passport strategy
module.exports = (passport) => {
  const jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOptions.secretOrKey = config.secret;
  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }));
};
