import express from 'express';
import passport from 'passport';
import { myprofile, logout } from '../config/user.js';
import isAuthenticated  from '../middleware/auth.js';

const router = express.Router();

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


export default router;
