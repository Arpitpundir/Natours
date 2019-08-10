const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: [3, "A name should have 3 or more letters"],
        minLength: [20, "A name should have 20 or less characters"],
        require: [true, "A name is required field."]
    },
    email: {
        type: String,
        require: [true, "An email is an required field."],
        validate: [validator.isEmail, "Please enter a valid email"],
        unique: true,
        lowercase: true
    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    password: {
        type: String,
        require: [true, "Password is a required field."],
        minLength: [8, "Password must be 8 or more characters long."],
        select: false
    },
    passwordConfirm: {
        //it is important to use that we can use model validatioon only when we save data in our database
        //so if we want to use these validation while using update then we have to save our updated data
        //again
        type: String,
        require: [true, "Please confirm your password."],
        validate: {
            validator: function (val) {
                return val == this.password;
            },
            message: "Please confirm password correctly."
        }
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active:{
        type: Boolean,
        default: true
    }
});


//middlewares are defined on schema
/*userSchema.pre("save", async function (next) {
    //run below code only if password was actually modified
    if (!this.isModified("password")) {
        return next();
    }

    //encrypt password with a cost
    this.password = await bcrypt.hash(this.password, 12);
    //above line of code would encrypt our password with a random string and even though the password are 
    //they are hashed at diffrent places (dont know what is the meaning of this)

    //now we can delete our confirm password because we no longer need it
    this.passwordConfirm = undefined;
    next();
});
*/
userSchema.pre(/^find/, async function(next){
    this.find({active: {$ne: false}});
    next();
})
userSchema.methods.checkPassword = async function (enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
    if (this.passwordChangedAt) {
        console.log("kl");
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            //this will work because this.passwordChangedAt() will return date and we can apply getTime on a date
            10
        );
        console.log(changedTimestamp, JwtTimeStamp, "kl");
        return JwtTimeStamp < changedTimestamp;
    }
    return false;
}

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10*60*1000;
    return resetToken;
}
const User = mongoose.model("User", userSchema);

module.exports = User;