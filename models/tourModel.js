//A schema is structure of a table i.e what field does a collection have what are their types and 
//other information.
const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./../models/userModel");
const slugify = require("slugify");

const tourSchema = mongoose.Schema({
    name: {
        type: "string",
        required: [true, "A tour must have a name."],
        unique: [true, "Every tour must have a unique name."],
        maxlength: [40, "A tour name should have 40 or less characters"],
        minlength: [10, "A tour name should have 10 or more characters"],
        // validate: {
        //     validator: validator.isAlpha,
        //     message: "Tour name should contain only letters"
        // }
        //property: [value, "message"]
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a maximum group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour mjust have a difficulty value."],
        enum: {
            values:["easy", "medium", "difficult"],
            message: "Difficulty can have values from easy, diffciult or hard only"
            //enum is used for specifying only possible values for a property.
        }
    },
    ratingsAverage: {
        type: Number,
        min: [1, "Rating should be 1 or above."],
        max: [5, "Rating should be 5 or below."],
        //min max can also be used for dates
        default: 4.5,
        set: val => Math.round(val*10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
    priceDiscount: {
        type: Number,
        // validator: function(val){
        //     return val > this.price;
        // },
        //validator is the name of the functionn that will execute for validation
        //when we also want to specify message along with the validator then we will use validate property
        validate: {
            validator: function(){
                return val > this.price;
            },
            message: "Discount should be less than price."
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary."]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image."]
    },
    images: [String], //we are going to save only names of images and then load them fromm the files itself
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour:{
        type: Boolean,
        default: false
    },
    //below is an example of embedding data in embedding data one object is embedded in another object
    //Storing geospatial data: we can store geospatial data in mongodb in the form GEojson object 
    //A geojson object contains a field name type and a field name coordinates that specifies the object's
    //coordinates
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        // now we are applying child refrencing what type of refrencing would be applied depends on 
        //the growth and update query for ex we can store a book id into publisher when no og published 
        //by publishers are small however if publisher is publishing large no books then we are making 
        //a book object along with that we are also updating our publisher therefore in this case it 
        //is more beneficial that we store publisher id in the books 
        {
            type:mongoose.Schema.ObjectId,
            ref: "User"//this is used to facilitate the relation between documents

        }
    ],
    slug: String//Array
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
    //if we want our query to show virtuals properties too than we have to set toJson true
);

// Indexing in mongodb are special data structures [1] 
//that store a small portion of the collection’s data set in an easy to traverse form
// The index stores the value of a specific field or set of fields, ordered by the value of 
//the field. The ordering of the index entries supports efficient equality matches and range-based 
//query operations

tourSchema.index({price: 1});
tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});
tourSchema.index({startLocation: "2dsphere"});
//2dsphere indexes support queries that calculate geometries on an earth-like sphere.

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});
//we use a general function syntax when we want to access this keyword because in arrow function we can
//not access this function.
//to see virtual properties in results of query we should set 

//now since we want to add reviews to when we send a single tour, so we will use virtual property for this
//and add avirtual property on the tour and then we can populate whenever we send tour

tourSchema.virtual("reviews", {
    ref: "Review",//the name of model referenced model
    foreignField: "tour",//name of property by which current model is refrenced in in other model
    localField: "_id"//localname of fileld of current model which is stored 
});
//lecture 24 Document Middleware

//middleware are functions in mongoose which are executed between some events
//middleware are function swhich are passed control during execution of asynchronous function.
//A document middleware is runs for the following functions.
//save
//validate
//remove
//init

//pre middleware function that executes one after another before a certain operation gets executed
//for ex when we make a middleware for save then this middleware will gets executed right before a docu
//ment gets inserted into a database
//middleware are defined on the schema


tourSchema.pre("save", function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
    //console.log(this);
    //this in this function would be the currently processing document 
});

//post document middleware 
//post middleware executes after execution of hooked method and all its pre middleware

//

//lecture 105 query middleware
//query middleware are for a no of hooks query function. In query middleware this refers to query object.

tourSchema.pre("find", function(next){
    this.start = Date.now();
    this.find({secretTour: {$ne: true}});
    next();
});

tourSchema.pre(/^find/, async function(next){
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt"
    });
    next();
});

tourSchema.post("find", function(docs, next){
    console.log(`this query took ${Date.now() - this.start} milliseconds`);
    next();
});

//lecture106 aggregate middleware
//In agreggate middleware this is agreggate object
tourSchema.pre("aggregate", function(next){
    //now what we want here is that our aggregate result should not show super secet tours weel we can always add a single
    // satge for every aggregation but it is easy to add miidleware which would work for all aggregates
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});
    console.log(this.pipeline);
    next();
});

// tourSchema.pre("save", async function(next){
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     //this will return a no of promises which we can save in our varable
//     this.guides = await Promise.all(guidesPromises);
//     //each and every promise would resolve to a user that would be saved as a guide object in the guide array
//     //So this is an example of embedding the data
//     next();
// }); 
//creating a model
const Tour = mongoose.model("Tour", tourSchema);
//the first argument is the singular name of collection for which this model is for
//and second argument is the name of schema

module.exports = Tour;

