const reviewControllers = require('./../controllers/reviewControllers');
const authControllers = require('./../controllers/authController');
const express = require('express');
const router = express.Router({
    mergeParams: true
});
//originally a router would have access to only to the parameteres that are directly  given to it
//but after applying merege this router would have alsoo access to parameter passed to other routers
//and current router is called fromt that router

//As reviews is a kind of intimate data that should be visible to the logged in user so
router.use(authControllers.protect);
//this function would run for all operations on the reviews

//this function is used to add tourId and userId to the body of req as body then can be directly used to 
//create a  review

router
    .route('/')
    .get(reviewControllers.getAllReviews)
    .post(
        authControllers.restrictTo('user'),
        reviewControllers.setTourUserIds,
        reviewControllers.createReview
    );

//i forgot to add two function before addding a review, it is a must that we check whether this user
//is secure before making a check to our password and if this user is secure whether this user has permiss
//-ssions to do this change

//when we are given a id of a review
console.log(authControllers.restrictTo('user'),
reviewControllers.updateReview)
router
    .route('/:id')
    .get(reviewControllers.getReview)
    .patch(
       authControllers.restrictTo('user', "admin"),
        reviewControllers.updateReview
    )
    .delete(
        authControllers.restrictTo('user', 'admin'),
        reviewControllers.deleteReview
    );
module.exports = router;