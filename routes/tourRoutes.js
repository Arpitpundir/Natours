const express = require('express');
const router = express.Router({
    mergeParams: true
});
const tourControllers = require('../controllers/toursControllers');
const authControllers = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

//router() returns a router type object , a router is an isolated instance of middleware and routes, It can
// treated as a mini-app that can only perform only routing and middleware functions.
router.use('/:tourId/reviews', reviewRouter);

//parameter middleware: the middleware that runs only when our url has certain parameter
//router.param("id", tourControllers.checkId);
//this middleware function will run only when there is an id parameter in url
router
    .route('/')
    .get(authControllers.protect, tourControllers.getAllTours)
    .post(tourControllers.createTour);
//now checkbody will be executed before addtour for all post requests.

router.route('/tourStats').get(tourControllers.getToursStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);
router
    .route('/:id')
    .delete(
        authControllers.protect,
        authControllers.restrictTo('admin', 'leadGuide'),
        tourControllers.deleteTour
    )
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.updateTour
    )
    .get(tourControllers.getTour);

    //A router for getting tours within a given radius
    //we can also implement this route using query but this is more general way
    router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourControllers.getToursWithin);

module.exports = router;