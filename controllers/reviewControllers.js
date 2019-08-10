//const catchAsync = require("./../utils/catchAsync");
const Review = require("./../models/reviewModel");
const Tour = require("./../models/tourModel");
const factory = require("./handlerFactory");

exports.setTourUserIds = (req, res, next) => {
     if(!req.body.tourId) req.body.tourId = req.params.tourId;
     if(!req.body.userId) req.body.userId = req.user.id;
     next();
}
exports.getAllReviews = factory.getAll(Review);//catchAsync(async (req, res, next) => {
//     let filter = {};
//     if(req.params.tourId)
//     filter = {tour: req.params.tourId};
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: "success",
//         message: reviews.length,
//         data: {
//             reviews
//         }
//     });
// });

exports.createReview = factory.createOne(Review);//catchAsync(async (req, res, next) => {

     // Allow nested routes
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.user = req.user.id;
//     const newUser = await Review.create(req.body); 
//     res.status(200).json({
//         status: "success",
//         data:{
//             user: newUser
//         }
//     });
// });

exports.deleteReview = factory.deleteOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
