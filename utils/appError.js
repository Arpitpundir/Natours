class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail":"error";
        this.isOperational = true;
        //this property would help us to identify between operational errors and other errors

        Error.captureStackTrace(this, this.constructor);
        //this line is to remove error constructor from error trace when error occurs
    }
}

module.exports = AppError;