const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const {
    promisify
} = require("util");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");


// const signInToken = id => {
//     const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
//     console.log(process.env.JWT_EXPIRES_IN, token.expiresIn);
//     return token;
// }

const signInToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res, req) => {
    const token = signInToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.signUp = catchAsync(async (req, res, next) => {

    //const user = await User.create(req.body);
    //problem with this code is that we are using all data that user is sending, due to which any user 
    //can make himself an admin because we are not filtering data,

    const user = await User.create(
        // 
        req.body
    );
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    //payload component is the data that we store in webtokens
    //payload could be an object literal, buffer or string representing valid JSON.

    // const token = signInToken(user._id);

    // res.status(201).json({
    //     status: "success",
    //     token: token,
    //     data: {
    //         user: user
    //     }
    // });

    createSendToken(user, 201, res, req);
});

exports.login = catchAsync(async (req, res, next) => {
    //console.log("klj")
    const {
        email,
        password
    } = req.body;
    //console.log(email, password);

    //steps one should check before logging in
    //1. whether email and password exist
    if (!email || !password) {
        return next(new AppError("Please enter email and password"), 400);
    }
    const user = await User.findOne({
        email: email
    }).select("+password");
    //console.log(user);
    //the select query is because we have set select property as false for passowrd in user model 
    //to make it invisible for the user

    //instance methods: instance of schema are docuements ,the methods we define on schema are available
    //for documents too 
    //syntax is schema.method.functionName = 

    //see userModel.js for a method that checks whether password is correct or not


    if (!user || !await user.checkPassword(password, user.password)) {
        return next(new AppError("Please enter valid email and password", 400));
        //401 unauthorised
    }
    createSendToken(user, 201, res, req);
});

exports.protect = catchAsync(async (req, res, next) => {

    //1 getting token and check if it exists
    let token;
    //there is a specific way tto send a jwt header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }else if(req.cookies.jwt){
        //if token is not in authorization header then check for token in cookie
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError("You are not logged in, please log in."), 401);
        //401 unauthorised
    }
    //2 verify the token
    //jwt.verify takes a third argument as a callback function , but we can make it to return a promise
    //by using promisify method
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);
    //if it is not verified then this promise would get rejected and then errorcontroller would be called
    //3 check if the user still exists

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError("The user beloging to this token does no longer exist", 401));
    }
    //4check if the user still exists after the token was issued

    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("user recently changed passwword"));
    }
    req.user = user;
    res.locals.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this task", 403));
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //getUser based on posted email
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        return next(new AppError("User with this email address do not exist"), 404);
        //404 not found
    }
    //2.now we will add a new password to our resetPassword property and then give this reset password to 
    //user and then user would use this password while changing the password as a means of verification.
    const resetToken = user.createResetPasswordToken();
    await user.save({
        validateBeforeSave: false
    });

    //SENDING MAILS
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    //there could be some error that can happen sendEmail i.e if promise gets rejected then in this case we need to reset email
    //resetPasswordToken and resetTokenexpiresIn tha would happen in catch block now since this error specific to sendemail
    //block therfore we will just use try and catch block here
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false
            //as we do not have full information of the user i dont knoe why but will look for it after
        });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});

//now we will finally reset our passowrd to remind what we have done till now 
//first step is to call forget password in forget password we generate a token and then send it as an email
//to the user with a link this link would call reset password that is next function also we have set this new token as a property
//in our user
//in reset function first we  would check whether our token is true or not or it has expired or not if token
//passes then we will update our new user with a new password this and also set our password updated at property

exports.resetPassword = catchAsync(async (req, res, next) => {

    //let's decrypt password our password
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    //now we will find our user with the help of token and also will check for that the expiry date for this password
    //should be greater than now
    let user = await User.findOne({
        passwordResetExpires: {
            $gt: Date.now()
        }
    });

    //2. if token has noe expired than set the new password
    if (!user) {
        next(new AppError("Token has expired or is invalid", 400));
    }

    //now update the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    //since these are no longer required
    await user.save();

    //3 update changedpasswordAt property for the user we will do this document middleware which would be triggerred 
    //just before the new document is saved
    //4 log in the user and the new jwt
    res.status(200).json({
        status: "success",
        token: signInToken(user._id)
        //send the new token after changing the password
    });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //whenever a loggedIn user would want to update password then we would always verify the user
    //1. Getting the user
    //this is coming from the protect middleware
    const user = await User.findById(req.user.id).select("+password");
    console.log(user);
    if (!user || !await user.checkPassword(req.body.passwordCurrent, user.password)) {
        return next(new AppError("Current user is not verified. Please login again", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save({
        validateBeforeSave: true
    });

    createSendToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
   // console.log("start")
    if (req.cookies.jwt) {
        try {
            console.log("ofg")
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists i.e after creating the user whether user has not deleted 
            const currentUser = await User.findById(decoded.id);
            console.log(currentUser)
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            //make it available to pug tenplates
            //console.log(currentUser);

            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

//just send a new cookie with token having a very small expiration time
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success'
    });
};