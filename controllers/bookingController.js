let stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
//const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// A Checkout Session represents your customer's session as they pay for
//  one-time purchases or subscriptions through Checkout. We recommend creating a new 
//  Session each time your customer attempts to pay.

// Once payment is successful, the Checkout Session will contain a reference to the Customer, 
// and either the successful PaymentIntent or an active Subscription

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    //console.log(process.env.STRIPE_SECRET_KEY)
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    //creating a checkout session for current purchase
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],//reqiuired
        success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items:[
            {// a list of items that customer is purchasing
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price*100,
                currency: "usd",
                quantity: 1
            }
        ]
        //above objects contains information about purchases items
    });
    //now we will send this session to frontend where we can finally charge user
    res.status(200).json({
        status: "success",
        session
    });
});