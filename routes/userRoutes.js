const express = require('express');
const fs = require('fs');

const router = express.Router();
const userControllers = require('../controllers/usercontrollers');
const authControllers = require('./../controllers/authController');
//the user api for ex signUp are not completely following rest architecture as we have specified our
//func
// Protect all routes after this middleware

router.route('/signup').post(authControllers.signUp);
router.route('/login').post(authControllers.login);
router.get('/logout', authControllers.logout);

router.route('/forgotPassword').post(authControllers.forgotPassword);
router.route('/resetPassword/:token').patch(authControllers.resetPassword);
// Protect all routes after this middleware
router.use(authControllers.protect);
router.route("/getMe", userControllers.getMe, userControllers.getUser);
router
    .route('/updatePassword')
    .patch(authControllers.updatePassword);
router
    .route('/updateMe')
    .patch(userControllers.uploadUserPhoto, userControllers.resizeUserPhoto, userControllers.updateMe);
//.single() accepts a single file with the fieldname given. This field name is  the name of the field 
//where file is present in the form
router
    .route('/deleteMe')
    .delete(userControllers.deleteMe);


//below functions can only be called from the admin 
router.use(authControllers.restrictTo('admin'));

router
    .route('/')
    .get(userControllers.getAllUsers)
    .post(userControllers.createUser);

router
    .route('/:id')
    .get(userControllers.getUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser);


//router.route("/changePassword").post(authControllers.changePassword);

//router.route("/:id").delete(userControllers.deleteUser).patch(userControllers.updateUser).get(userControllers.getUser);
//router.route("/forgotPassword").post(authControllers.forgotPassword);
//router.route("/changePassword").post(authControllers.changePassword);
module.exports = router;