const fs = require("fs");
//express code should be in app.js
const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes")
const AppError = require("./utils/appError");
const path = require("path");
const globalErrorHandler = require("./controllers/errorControllers");
const pug = require("pug");
const viewRouter = require("./routes/viewRoutes");
const cookieParser = require("cookie-parser");
//const app = express();
//will provide a bunch of methods to app varibale

//Routing: specifying what a server will do when it get a specific url
//now  we will do routing
//Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).


//app.typeOfRequest("url", callbackFunction);
/*
app.get("/", (req, res) => {
    //for sending back something
    //res.send("This is a message form server");
    //res.status(200).send("Hello, from the server");
    res.status(200).json({message: "This is a message from the server",
    app: "natours"});
})

app.post("/", (req, res) => {
    res.status(200).send("You can post to this url");
})app.use("/app/v1/users", userRouter);
const port = 3000;
app.listen(port, () => {
    console.log("Server has started.");
})
*/
//what is API?
//A piece of software that is used by another piece of software to allow applications to interact with one another
//RESTfull api design Representational state tansfer
//we follow rest api protocol to make apis easy to use

//1.Seperate API into logical resources
//All the data that we want to share should be divided into resources
//Resources: An object representation or any kind of representation that has some kind of data associated with
//it. Any information that can be named is a resource. It has to be name though not a verb

//2. use resources based urls
//3. use http methods(verbs)
//rest api design says that our api should just contain resouces not the actions that we want to perform
//for ex getStudentData is not a good endpoint but inplace of such endpoints we can use method such as get, post
//update, delete for getStudenData we can use GET method and student as an endpoint.
//CRUD create, read, update and delete.

//4. Send data as json
//5. Stateless ap.
//All state are handeled on the client. This means that a request should contain all information that is necessary
//to process a certain request. Server should not have to store previous request information to process a certain
//request.

//Making a get reqest working
//const port = 8000;
const app = express();
app.engine('pug', require('pug').__express)
//save the mismatch of module 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
//parses the incoming requests and add a body property to the req object 
//this is a middleware this middle would be used to adjust upcoming request, it stand between
//request and response
//parses the data from  body
app.use(cookieParser());
//parses the data from cookie
app.use(morgan("dev"));
//a request logging middleware for node.js
//logs the infomation about the requests

app.use((req, res, next) => {
    //console.log("Hello form the server");
    //console.log(req.params);
    next();
});

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    
    next();
});

app.use('/', viewRouter);

//these above four middleware we want to apply at all routes 
//console.log("k")
app.use("/api/v1/tour", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/booking", bookingRouter);
//these above two middleware we want to apply on the routes that are specified

//lecture 111 defining router for handling invalid urls

//now if a url reaches here then this means it was nont being handeled by tours and users handlers
//so it is an invalid url

app.all("*", (req, res, next) => {
    // res.status(400).json({
    //     status: "failed",
    //     message: `${req.originalUrl} is not supported on this server`
    // });

    // const err = new Error (`${req.originalUrl} is not supported on this server`);
    // err.status = "failed";
    // err.statusCode = 400;
    const err = new AppError(`${req.originalUrl} is not supported on this server`, 400);
    next(err);
    //whenever we call next() with an argument then this argument would alwayas be treated like an error
});

app.use(globalErrorHandler);



//app.listen(port, () => {
//    console.log("Server has started.");
//})
/*
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: toursData.length,
        data: {
            tours: toursData
        }
    })
}

const addTour =  (req, res) => {
    
    //console.log(req.body);
    const newId = toursData.length + 1;
    const newTour = Object.assign({id: newId}, req.body);
    //this method is used to copy all properties of one object to a target object.

    toursData.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), () => {
        res.status(201).json({
            status: "success",
            data : {
                tour: newTour
            }
        });
    //console.log(req.body);
    const newId = toursData.length + 1;
    const newTour = Object.assign({id: newId}, req.body);
    //this method is used to copy all properties of one object to a target object.

    toursData.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursData), () => {
        res.status(201).json({
            status: "success",
            data : {
                tour: newTour
            }
        })
    })
    });
}

const getSingleTour =  (req, res) => {
    //console.log(req.params);
    //elements after : are called parameteres for a request req.param is an object containing values of this 
    //parameteres where property name is name of parameter and value of property is the value given in the specific 
    //parameter.
    //a parameter after : sign is essential i.e a value must be given for such a parameter, but a parameter after
    //? is optional i.e you may or may not give value for such a parameter, if you have not given value for such a
    //a parameter than it will have unefined
    //const reqTourId = req.param.id;

    
    //did not work because it is a string
    const reqTourId = req.params.id * 1;
    console.log(req.param.id);
    console.log(reqTourId);
    if(reqTourId > toursData.length){
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    const reqTour = toursData.find((tour) => (tour.id == reqTourId));
    console.log(reqTour);
    res.status(200).json({
        status: "success",
        requestedTime: req.requestedTime,
        data: {
            tour: reqTour
        }
    })
}

const updateTour = (req, res) => {

    const tourId = req.params.id * 1;
    if(tourId > toursData.length){
        return res.status(404).json({
            status: "fail",
            message: "req tour not found"
        })
    }
    res.status(200).json({
        status: "success",
    })
}

const deleteTour = (req, res) => {

    const tourId = req.params.id * 1;
    if(tourId > toursData.length){
        return res.status(404).json({
            status: "fail",
            message: "req tour not found"
        })
    }
    res.status(204).json({
        //status 204 is used when we sens no content
        status: "success",
    })
}



const getAllUsers = (req, res, user) => {
    res.status(500).json({
        status: "failed",
        message: "bad request"
    })
}

const getUser = (req, res, user) => {
    res.status(500).json({
        status: "failed",
        message: "bad request"
    })
}

const updateUser = (req, res, user) => {
    res.status(500).json({
        status: "failed",
        message: "bad request"
    })
}

const deleteUser = (req, res, user) => {
    res.status(500).json({
        status: "failed",
        message: "bad request"
    })
}

const patchUser = (req, res, user) => {
    res.status(500).json({
        status: "failed",
        message: "bad request"
    })
}

const addUser = (req, res, user) => {
    res.status(500).json({
        status: "failed",
        message: "bad request"
    })
}
//app.get("/api/v1/tours", getAllTours);
//app.post("/api/v1/tours", addTour);
//making a request to get a specific tour
//app.get("/api/v1/tours/:id", getSingleTour);
//we use patch when we are just updating an object and we use put when we are replacing full object
//app.patch("/api/v1/tours/:id", updateTour);
//app.delete("/api/v1/tours/:id", deleteTour);

const tourRouter = express.Router();
//Another method 
tourRouter.route("/")
    .get(getAllTours)
    .post(addTour);
    
tourRouter.route("/:id")
    .get(getSingleTour)
    .patch(updateTour)
    .delete(deleteTour);
*/
//since this tourRouter is a middleware therefore we will use app.use method to connect to this to app
//app.use("/api/v1/tours", tourRouter);
//this is called mounting a new router on a route.
//would create a new router
//now we can define our routes for route "/api/v1/tours" on this route because when we are going to seperate 
//user and tour in diffrent files.

//Introduction to middleware
//A function that gets executed between receiving a request and sending a response, in express everything 
//is a middleware even our routes are middleware that gets executed only for certain urls
//All the middleware are called middleware stack. the order of execution of middleware is same in which they app
//-ear in the code. so its important to pay attention to the position of a middleware.
//A general middlewae is applied on all requests.
//A middleware has excess to req and response object and next function that gets executed. Generally last middleware
// is  router function for the specific requests. 
/*
const userRouter = express.Router();
app.route("/")
    .get(getAllUsers)
    .post(addUser);
    
app.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);
*/
//app.use("/app/v1/users", userRouter);

module.exports = app;