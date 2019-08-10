const mongoose = require("mongoose");
const Tour = require("./../models/tourModel");``

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        require: [true, "A message is required for a review"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"]
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

reviewSchema.index({tour: 1, user: 1}, {unique: true});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    console.log(tourId, "kl");
    const stats = await this.aggregate([{
            $match: {
                tour: tourId
            },
        },
        {
            $group: {
                _id: "$tour",
                nRating: {
                    $sum: 1
                },
                avgRating: {
                    $avg: "$rating"
                }
            }
        }
    ]);
    console.log(stats);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
}

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name photo"
    });
    next();
});

reviewSchema.post("save", function () {
    //before saving a  review recalculate the corresponding tour rating and avg
    this.constructor.calcAverageRatings(this.tour);
});

// Now we have managed to update our tour average rating and average quantity by using save middleware 
//but what if one of our review gets updated or deleted, to soleve this we will use query middleware
//now in query middleware we do not have our doc
reviewSchema.pre(/^findOneAnd/, async function(next){
    //now we are doing this to made our document available for next post function so that we can call
    //constructor calcAverageRatings
    this.r = await this.findOne();
    //console.log(await this.findOne());
    next();
});
//we are using post ,iddleare because we want to use updated records
reviewSchema.post(/^findOneAnd/, async function(){
    console.log(this.r);
    await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;