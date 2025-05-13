const router = require('express').Router();
const passport = require('passport');
const {myprofile , logout} = require('../config/user');
const { isAuthenticated } = require('../middleware/auth');

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: `${process.env.BASE_URL}/`,
    failureRedirect: `${process.env.BASE_URL}/auth`,
})
);

// GitHub Auth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: `${process.env.BASE_URL}/`,
    failureRedirect: `${process.env.BASE_URL}/auth`,
}));

router.get('/logout', logout);

router.get('/me', isAuthenticated, myprofile)


module.exports = router;
