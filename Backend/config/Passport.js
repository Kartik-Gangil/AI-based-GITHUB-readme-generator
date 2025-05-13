const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
require('dotenv').config();
const User = require('../DB/User.js')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ Id: profile.id })
        if (!user) {
            const newUser = new User({
                Id: profile.id,
                Photo: profile.photos[0].value,
                name: profile.displayName,
                mode: 'Google',
                Email: profile.emails[0].value,
                Password: 'null'
            });
            await newUser.save();
            return done(null, newUser);
        }
        else {
            return done(null, user);
        }
    }

));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        
        const user = await User.findOne({ Id: profile.id })

        if (!user) {
            const newUser = new User({
                Id: profile.id,
                Photo: profile.photos[0].value,
                name: profile.displayName,
                mode: 'Github',
                Email: profile.profileUrl,
                Password: 'null'
            });
            await newUser.save();
            return done(null, newUser);
        }
        else {
            return done(null, user);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user); // store entire user or user.id
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id); // fetch user from DB if needed
    done(null, user); // fetch user from DB if needed
});
