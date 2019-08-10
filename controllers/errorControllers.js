//lecture 113 creating a handler for all errors, this miidleware would be called whenever an occur in one 
//of above handler

const AppError = require("./../utils/appError");

const handleJwtExpired = err =>{
    return new AppError("Your token has expired", 401);
}
const handelJwtError = err => {
    return new AppError("Invalid Token. Please login again", 401);
}
//lecture 117 seperating devlopment and production errors response
const handleCasteError = err => {
    const message = `Invalid Id ${err.path}:${err.value}`;
    return new AppError(message, err.statusCode);
}

const handleDulicateKeyError = err => {
    //when user enters a value for a unique that is already taken by another user
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    //regular expression for taking out the value of the field
    const message = `Dulicate key: ${value} for the field`;

    return new AppError(message, err.statusCode);
}

const handleValidationError = (err) => {
    err = Object.values(err.errors).map(el => el.message);
    //Object.values
    const message = `Invalid request: ${$err}`;
    return new AppError(message, err.statusCode);
}

const devModeErrorResponse = (req, res, err) => {
    //function which would handle the errors when we are running in devlopment mode
    if(req.originalUrl.startsWith("/api")){
        //basically these errors are made during the requests which were made by applications not by the 
        //user
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    }
    console.log("Error", err);
    return res.status(err.statusCode).render("error", {
        title: "Something went very wrong",
        msg: err.message
    });
}

const prodModeErrorResponse = (req, res, err) => {

    //this is an operational error something that we knew that could happen, so we can significant amount 
    //of information to the user
    if(req.originalUrl.startsWith('/api')){
        //then we are not rendering website
        if(err.isOperational){
            return res.status(err.statusCode.json({
                status: err.status,
                message: err.message
            }));
        }
        //if error is unknown then do not leak details
        console.log("Error", err);
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!"
        });
    }

    //now we can render website if error is not in api
    if(err.isOperational){
        console.log(err);
        return res.status(err.statusCode).render("error", {
            title: "Something went very wrong",
            msg: err.message
        });
    }
    //now if error is related to something related programming then do not leak it to user
    console.log("Error");
    return res.status(err.statusCode).render("error", {
        title: "Something went very wrong",
        msg: "Please try again."
    });
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV == "devlopment") {
        devModeErrorResponse(req, res, err);
    } else {
        //lecture 118 invalid ids
        //error due to mongoose for ex invalid ids and others invalidation errors are still not set to 
        //operational errors so when such error occurs then we are sending just insignificant information
        //to the user but in such cases we should send information to the user which could help the user
        //in correcting the error, we will do the same by checking for such errors and then making a new error 
        //with our AppError class and then send this new error to the user.
        let error = {...err};
        error.message = err.message;
        //console.log(error);
        //it is not a good practice to mutate original object
        if (error.name == "CastError") {
            error = handleCasteError(error);
        }
        if(err.code == 11000){
            //lecture 119 
            //2nd type of error that could be generated by mongoose is duplicated ids while creating a new
            //tour this error does not have a name because this error is actually created by mongodb so to reco
            //gnize this error we will use error code
            error = handleDulicateKeyError(error);
        }
        if(err.name == "validationError"){
            //third type of errors that could be generated by mongoose are the validation errors 
            error = handleValidationError(error);
        }
        if(error.name == "JsonWebTokenError"){
            error = handelJwtError(error);
        }
        if(error.name == "TokenExpiredError"){
            error = handleJwtExpired(error);
        }
        prodModeErrorResponse(req, res, error);
    }
    next();
};