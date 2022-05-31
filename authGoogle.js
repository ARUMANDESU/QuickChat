const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const Google_ID = "947660833205-307a51ve5002akdvb4d78aqsp99nvodu.apps.googleusercontent.com";
const Google_Secret = "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";

passport.use(new GoogleStrategy({
    clientID: Google_ID,
    clientSecret: Google_Secret,
    callbackURL: "https://quick--chat.herokuapp.com/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
    
  }
));

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})
