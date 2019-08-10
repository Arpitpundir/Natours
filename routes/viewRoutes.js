const express = require('express');
const viewsControllers = require('./../controllers/viewControllers');
const authControllers = require('../controllers/authController');

const router = express.Router();

router.get('/', authControllers.isLoggedIn, viewsControllers.getOverview);
router.get('/tour/:slug',  authControllers.isLoggedIn, viewsControllers.getTour);
router.get('/login',authControllers.isLoggedIn, viewsControllers.getLoginForm);
router.get('/signup', viewsControllers.getSignupForm);

//this  upper route is just resposible for loading the form not for the looging in functionality
//router.get("/logout", authControllers.isLoggedIn, authControllers.logout);
router.get('/me', authControllers.protect, viewsControllers.getAccount);

router.post(
    '/submit-user-data',
    authControllers.protect,
    viewsControllers.updateUserData
);
module.exports = router;