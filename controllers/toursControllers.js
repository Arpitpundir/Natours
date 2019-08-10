const fs = require('fs');
const Tour = require('./../models/tourModel');
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
//const ApiFeatures = require('./../utils/apiFeatures');

/*
const toursDataJson =  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`);
const toursData = JSON.parse(toursDataJson);
*/

//for querying all tours we will use collection.find() api this api takes a selector as argument and retu
//urna an array of matched documents if we do not give any selector than it returns all documents
//of a selector
// exports.getAllTours = async (req, res) => {
//   //console.log("jjkl");
//   try{
//       const allTours = await Tour.find();
//       console.log("tatti");
//       res.status(200).json({
//           status: "success",
//           //data: {
//             //  tours: toursData
//           //}
//           data: {
//             tours: allTours
//           }
//       })
// }catch(error){
//   res.status(400).json({
//     status: "Failed",
//     message: error
//   });
// }
// }

/*exports.checkId = (req, res, next, id) => {
    if(id > toursData.length){
        return res.status(500).json({
            status: "failed",
            message: "Enter a valid Id"
        })
    }
    next();
}*/
/*
exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
        return res.status(404).json({
            status: "failed",
            message: "Invalid Content"
        })
    }
    next();
}
*/
//exports.addTour =  (req, res) => {

//console.log(req.body);
//     const newId = toursData.length + 1;
//     const newTour = Object.assign({id: newId}, req.body);
//     //this method is used to copy all properties of one object to a target object.

//     toursData.push(newTour);
//    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), () => {
//         res.status(201).json({
//             status: "success",
//             data : {
//                 tour: newTour
//             }
//         });
//console.log(req.body);
//const newId = toursData.length + 1;
//const newTour = Object.assign({id: newId}, req.body);
//this method is used to copy all properties of one object to a target object.

//toursData.push(newTour);
//fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), () => {
//  res.status(201).json({
//    status: "success",
//  data : {
//    tour: newTour
//}
//})
//})
//});

//}

//Now we are going to implement our addTour function using Tour model.As you know whenever we use new model
//Name then it returns a promise in this implementation we would be using async and await
/*exports.addTour = async (req, res) => {
  try {
    //let's create a documents of type tour so that we can insert it into our database
    //in previous examples in server.js we have use new keyword and then save on newly vreated instance
    //but inthis example we will use create keyword directly on Tour model, create function returns a promise
    const newTour = await Tour.create(req.body);
    //returned promise would either resolves to the newly created object or to a new error, this is taken
    //care by try and catch method

    // if(req.status == 201){
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
    //}
  } catch (error) {
    console.log('Error', error);
    res.status(400).json({
      status: 'failed',
      message: error
    });
  }
};
*/
//lecture 115
/*
let catchAsync = fn =>{
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  } 
}

exports.addTour = catchAsync(async(req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
});
*/

/*exports.getSingleTour = async (req, res) => {
  //console.log(req.params);
  //elements after : are called parameteres for a request req.param is an object containing values of this
  //parameteres where property name is name of parameter and value of property is the value given in the specific
  //parameter.
  //a parameter after : sign is essential i.e a value must be given for such a parameter, but a parameter after
  //? is optional i.e you may or may not give value for such a parameter, if you have not given value for such a
  //a parameter than it will have unefined
  //const reqTourId = req.param.id;

  //did not work because it is a string
  // const reqTourId = req.params.id * 1;
  //console.log(req.param.id);
  //console.log(reqTourId);
  //if(reqTourId > toursData.length){
  //  return res.status(404).json({
  //    status: "fail",
  //  message: "invalid id"
  //})
  //}
  const reqTour = await Tour.findById(req.params.id);

  //  console.log(reqTour);
  try {
    res.status(200).json({
      status: 'success',
      //requestedTime: req.requestedTime,
      data: {
        tour: reqTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error
    });
  }
};

exports.getSingleTour = catchAsync(async (req, res, next) => {
  const reqTour = await Tour.findById(req.params.id).populate("reviews");

  if(reqTour ==  null){
    return next(new AppError("This tour does not exist", 404));
    //returning is important here because without returning function will continue to execute and we will 
    //have two response
  }
  res.status(200).json({
    status: 'success',
    //requestedTime: req.requestedTime,
    data: {
      tour: reqTour
    }
  });
});
/*exports.updateTour = async (req, res) => {
  // const tourId = req.params.id * 1;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
      //this property is used to specify that the new object sg=hould be passed to all validators
      //before inserting in the database
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
    //above method finds the given tour, update it to according to the given second argument, third argument
    //is used to specify some extra information about how the new object should be updated
    //if(tourId > toursData.length){
    //  return res.status(404).json({
    //    status: "fail",
    //  message: "req tour not found"
    //})
    //}
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    });
  }
};

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
    //this property is used to specify that the new object sg=hould be passed to all validators
    //before inserting in the database
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  });
})

//as you know we are not sending any callback function after writing data to our database
//which happens asynchronously but we are using async await function due to which the whole function
//gets executed asynchronously
/*exports.deleteTour = async (req, res) => {
  //const tourId = req.params.id * 1;
  //if(tourId > toursData.length){
  //  return res.status(404).json({
  //    status: "fail",
  //  message: "req tour not found"
  //})
  //}
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      //status 204 is used when we sens no content
      status: 'success'
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed'
    });
  }
};
*/
/*exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    //status 204 is used when we sens no content
    status: 'success'
  });
})
exports.deleteTour = factory.deleteOne(Tour);
//Filtering
//in filtering we send some parameters along with their values in our request then server returns data that is only compatible with
//these parameters.
//parameters can be seen in the postman in params tab
//in our express app we have access to all these query prameteres in req.query
//this is how we make a filtered requests (127.0.0.1:8000/api/v1/tours?duration=5&difficulty=easy)

//Queries and Queries
//Models in mongoose provide a no of helpfull operations to execute crud operations all these operations ret
//returns a Query object.
//Queries in mongoose can be executed in two ways

//1. when we pass a callback operations to our query in this method callback function gets executed
//with two arguments 1st is error and 2nd is the result of above query, result can vary from query
//to query for ex for count() result would be no of documents, for find() result would be array of documents
//and if error occurs result would be null.

// var Person = mongoose.model('Person', yourSchema);

// // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   // Prints "Space Ghost is a talk show host".
//   console.log('%s %s is a %s.', person.name.first, person.name.last,
//     person.occupation);
// });

//2. when we do not pass a callback function then mongoose returns a Query type object

// var query = Person.findOne({ 'name.last': 'Ghost' });

// // selecting the `name` and `occupation` fields
// query.select('name occupation');

// // execute the query at a later time
// query.exec(function (err, person) {
//   if (err) return handleError(err);
//   // Prints "Space Ghost is a talk show host."
//   console.log('%s %s is a %s.', person.name.first, person.name.last,
//     person.occupation);
// });

// in the above example query variable is an object of type Query, there are a no of functions that can be applied
//on these object to further help with our queries

//queries are executed asynchronously and have a then function but they are not promises, executing then function of a
//query will lead to execution of query same no fo times

/*exports.getAllTours = async (req, res) => {
  //console.log("jjkl");
  try {
    //console.log(req.query);

    //there are two diffrent ways of making a query with parameteres in mongo
    //1. we can make pass query string just like we do in mongodb for ex
    // const allTours = await Tour.find({
    //   duration: 5,
    //   difficulty: "easy"
    // });

    //2. We can use mwthods of mongoose to make a filtered query
    // const allTours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // const allTours = await Tour.find(req.query);

    //Removing extra fields
    // 
    // let queryObject = {...req.body};
    // const extraFields = [""];
    // extraFields.forEach(el => delete queryObject[el]);

    //Advanced filtering : Now if we want to use operators like gte and lte in out filter query than we
    //127.0.0.1:8000/api/v1/tours?duration[gte]=5&difficulty=easy
    let queryObject = {...req.query};
    let queryString = JSON.stringify(queryObject);
    console.log(queryString);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryString));

    const allTours = await Tour.find(JSON.parse(queryString));

    // const allTours = await Tour.find();
    res.status(200).json({
      status: 'success',
      //data: {
      //  tours: toursData
      //}
      data: {
        tours: allTours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error
    });
  }
};
*/

//Sorting the data
//127.0.0.1:8000/api/v1/tours?sort=price

/*exports.getAllTours = async (req, res) => {
  try {
    // let queryObject = { ...req.query };

    // let allTours =  Tour.find();
    //if we wait for a query then it oeuld have returned a documents so we can not aplly any other methods
    //on it. So we should await for the query at the end
    //console.log(queryObject.sort)
    //allTours = allTours.sort(queryObject.sort);

    //by now we have build our query no w we can execute our query

    //limiting fields: When we want to send only specific fields of data object to the user, then we can use
    //select method on our query object
    //Specifies which document fields to include or exclude (also known as the query "projection")
    // When using string syntax, prefixing a path with - will flag that path as excluded. When a path does not have the - prefix, it is included.
    //we specify fields like this (127.0.0.1:8000/api/v1/tours?fields=name,duration,difficulty,price)
    //(127.0.0.1:8000/api/v1/tours?fields=-name,-duration,difficulty,price)
    // query.select('a b');

    // // exclude c and d, include other fields
    // query.select('-c -d');

    // const responseFields = req.query.fields.split(",").join(" ");
    // console.log(responseFields);
    // allTours = allTours.select(responseFields);
    // allTours = await allTours;

    //Pagination
    //when we have a karge noi of results then we might want to split our data into a no of pages
    //A user can demand any page and there is a limit to the no of results that we want to show on a page.
    //A request with pagination looks like
    //127.0.0.1:8000/api/v1/tours?page=2&limit=3

    //Implementation of pagination:: we use skip and limit method on our query object
    //.skip() used tp specify the no of documents to skip
    //.limit() specifies max no of documents the query will return
    // Example
    // query.skip(100).limit(20)

    // const page = req.query.page*1 || 1;
    // const limit = req.query.limit*1 || 100;
    // const skip = (page-1)*limit;
    // console.log(skip);
    // console.log(req.query.limit);
    // allTours = allTours.skip(skip).limit(limit);

    // if(req.query.page){
    //   const numTours = Tours.countDocuments();
    //   if(numTours >= skip){
    //     throw new Error ("This page does not exist");
    //   }
    // }
    console.log('jjk');
    console.log(req.query);
    //console.log(Tour.find());
    let features = new ApiFeatures(Tour.find(), req.query);
    console.log('abhs');
    console.log(features.queryString);
    features
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //this is possible because we are returning this object form each of these functions

    const allTours = await features.query;
    console.log(allTours);
    //now we will await for the query that we passed to function, although we have applied diffeent function
    //to this query but all these function are being applied on the the query that we have passed to
    //in the features section
    //so we can await for that query
    //console.log(allTours)

    // const allTours = await Tour.find();
    res.status(200).json({
      status: 'success',
      //data: {
      //  tours: toursData
      //}
      data: {
        tours: allTours
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error
    });
  }
};
//We can also exclude data right from schema by setting select property of the field as false, this is used
//in case of secnsitive data

exports.getAllTours = catchAsync(async(req, res, next) => {
  let features = new ApiFeatures(Tour.find(), req.query);
    
    features
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //this is possible because we are returning this object form each of these functions
    const allTours = await features.query;
    res.status(200).json({
      status: 'success',
      //data: {
      //  tours: toursData
      //}
      data: {
        tours: allTours
      }
    });
});
*/
class ApiFeatures {
  constructor(query, queryString) {
    console.log('consStr');
    this.query = query;
    this.queryString = queryString;
    console.log('jiloop');
  }

  filter() {
    console.log('filtt');
    let queryObj = {
      ...this.queryString
    };
    let excludedFields = ['sort', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    console.log(queryObj);
    let queryString = JSON.stringify(queryObj);
    console.log(queryString);
    queryString = queryString.replace(
      /\b(lte|lt|gte|gt)\b/g,
      match => `$${match}`
    );
    console.log(queryString);
    //this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    console.log('sortSt');
    if (this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createBy');
    }
    return this;
  }

  limitFields() {
    console.log('limSt');
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    }
    return this;
  }

  paginate() {
    //console.log("jkl");
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //console.log(skip);
    //console.log(this.queryString.limit);
    this.query = this.query.skip(skip).limit(limit);
    //console.log("pagMed");
    if (this.queryString.page) {
      const numTours = Tour.countDocuments();
      if (numTours >= skip) {
        //  console.log("error");
        throw new Error('This page does not exist');
      }
    }
    //console.log("pagEnd");
    return this;
  }
}

//Aggregation
//Aggregation operations group values from multiple documents
//together, and can perform a variety of operations on the grouped data to return a single result
//Aggregation pipeline is a framework for aggregation in which documents are passed to through a no
//stages at every stage there are some operation applied to documents due to 
// these operations the documents get converted into aggregated results.

//Model.aggregate() is a mongoose function that takes pipeline stages in an array.
//collection documents pass thorough the stages in sequence.
//there are a no of stages that can be seen in documentation.

//If a callback is passed, the aggregate is executed and a Promise is returned.
//If a callback is not passed, the aggregate itself is returned.
//Syntax Example
// Find the max balance of all accounts
// Users.aggregate([
//   { $group: { _id: null, maxBalance: { $max: '$balance' }}},
//   { $project: { _id: 0, maxBalance: 1 }}
// ]).
// then(function (res) {
//   console.log(res); // [ { maxBalance: 98000 } ]
// });

// // Or use the aggregation pipeline builder.
// Users.aggregate().
//   group({ _id: null, maxBalance: { $max: '$balance' } }).
//   project('-id maxBalance').
//   exec(function (err, res) {
//     if (err) return handleError(err);
//     console.log(res); // [ { maxBalance: 98 } ]
//   });

//$match
// Filters the documents to pass only the documents that match the specified condition(s) to the next
//pipeline stage.

// The $match stage has the following prototype form:

// { $match: { <query> } }

// $match takes a document that specifies the query conditions. The query syntax is identical
// to the read operation query syntax; i.e. $match does not accept raw aggregation expressions.
// Instead, use a $expr query expression to include aggregation expression in $match.

exports.getToursStats = async (req, res) => {
  //console.log('hjk');
  try {
    //console.log('hjk');
    const stats = await Tour.aggregate([
      //{$stageName: {query}}
      {
        $match: {
          ratingsAverage: {
            $gte: 4.5
          }
        }
      },
      {
        $group: {
          // _id: null,
          //_id is used to specify the property by which we want to group
          _id: '$difficulty',
          //this is null means that we want evything in a single group
          numTours: {
            //$sum
            // Calculates and returns the sum of numeric values. $sum ignores non-numeric values.

            // Changed in version 3.2: $sum is available in the $group and $project stages. In previous versions of MongoDB, $sum is available in the $group stage only.

            // When used in the $group stage, $sum has the following syntax and returns the collective sum of all the numeric
            //values that result from applying a specified expression to each document in a group of documents that share the
            //same group by key:

            // { $sum: <expression> }

            $sum: 1
          }, //for every documents that will pass thorugh this stage of pipeline 1 would be added
          //to this variable
          avgRating: {
            $avg: '$ratingsAverage'
          },
          //$operator: "$property on which we want to apply this operator"
          avgPrice: {
            $avg: '$price'
          },
          minPrice: {
            $min: '$price'
          },
          maxPrice: {
            $max: '$price'
          },
          numRatings: {
            $sum: '$ratingQuantity'
          }
        }
      },
      {
        //now in these stage documents are coming from the above stages therefore they have been divided into
        //groups, so now our documents are groups having property that we have specified while building the group
        //so to apply an operator we will use new property name.

        //           $sort
        // Sorts all input documents and returns them to the pipeline in sorted order.

        // The $sort stage has the following prototype form:

        // { $sort: { <field1>: <sort order>, <field2>: <sort order> ... } }
        // $sort takes a document that specifies the field(s) to sort by and the respective sort order. <sort order> can have one of the following values:

        // 1 to specify ascending order.
        // -1 to specify descending order.
        $sort: {
          avgRating: 1
        }
      }

      //         {
      // //           $ne
      // // Syntax: {field: {$ne: value} }
      // // $ne selects the documents where the value of the field is not equal to the specified value.
      // //  This includes documents that do not contain the field.
      //           $match: {_id: {$ne: "easy"}}
      //         }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error
    });
  }
};

//Groups documents by some specified expression and outputs to the next stage a document
//for each distinct grouping. The output documents contain an _id field which contains the distinct
// group by key. The output documents can also contain computed fields that hold the values of some
//accumulator expression grouped by the $group’s _id field. $group does not order its output documents.

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      //$unwind
      // Deconstructs an array field from the input documents to output a document for each element.
      //Each output document is the input document with the value of the array field replaced by the
      //element. now if a document had 5 elements in the array then now there would be 5 such documents
      //with all properties same but only there would be a unique element of the array in place of array

      // The $unwind stage has one of two syntaxes:

      // The operand is a field path:

      // { $unwind: <field path> }
      // To specify a field path, prefix the field name with a dollar sign $ and enclose in quotes.

      // The operand is a document:
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-1-1`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            //$month
            // Returns the month of a date as a number between 1 and 12.

            // The $month expression has the following operator expression syntax:

            // { $month: <dateExpression> }
            $month: '$startDates'
          },
          numTours: {
            $sum: 1
          },
          toursName: {
            $push: '$name'
          }
        }
      },
      // $push
      // Returns an array of all values that result from applying an expression to each document in a group of documents that share the same group by key.

      // $push is only available in the $group stage.

      // $push has the following syntax:

      // { $push: <expression> }
      // db.sales.aggregate(
      //   [
      //     {
      //       $group:
      //         {
      //           _id: { day: { $dayOfYear: "$date"}, year: { $year: "$date" } },
      //           itemsSold: { $push:  { item: "$item", quantity: "$quantity" } }
      //         }
      //     }
      //   ]
      // )
      {
        $addFields: {
          month: '$_id'
        }
      },
      //   $addFields
      // New in version 3.4.

      // Adds new fields to documents. $addFields outputs documents that contain all existing fields from the input documents and newly added fields.

      // The $addFields stage is equivalent to a $project stage that explicitly specifies all existing fields in the input documents and adds the new fields.

      // $addFields has the following form:

      // { $addFields: { <newField>: <expression>, ... } }
      {
        $sort: {
          numTours: -1
        }
      },
      {
        $project: { _id: 0 }
      },
      //refer Documentatiopn for studying about $project stage
      {
        $limit: 6
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan: plan
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error
    });
  }
};


//lecture23 section 8 virtual properties
//virtual properties are that we can set and get but such properties do not get persisted to the database
// personSchema.virtual('fullName').get(function () {
//   return this.name.first + ' ' + this.name.last;
// });

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const {distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');

    //mongo takes radius in radians so we have to convert the radius in km or miles into radians by dividing it
    //by the radius of the earth
    if(!lat || !lng){
      next(new AppError("Please provide latitude and longitude in the format lat,lng", 400));
    }
    const radius = unit == "mi" ? distance / 3963.2 : distance/6378.1;
    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius]}}
      //$geoWithin is an in built operator mongo which takes the location from which we have to find 
      //the tours and the radius in which we need to find
      //$centerSphere draws circle on the sphere
    });
    console.log(tours)
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        data: tours
      } 
    });
});