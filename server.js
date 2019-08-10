//it is a good practice to keep all of our express related work in one file and all our server related work 
//in a seperate file
const app = require("./app");
const mongoose = require("mongoose");
//const port = 3000;
const dotenv = require("dotenv");//.config({path: "./config.env"});
console.log(app.get("env"));
dotenv.config({path: "./config.env"});
//this command would make all the variable in this file as node variable

//console.log(process.env);
//connecting express app to mongoodb database
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    //console.log(con.connections);
    console.log("DB connections successfull");
});
/*
//A schema is structure of a table i.e what field does a collection have ehat are their types and 
//other information.
const tourSchema = mongoose.Schema({
    name: {
        type: "string",
        required: [true, "A tour must have a name."],
        unique: [true, "Every tour must have a unique name."]
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    }
});

//creating a model
const Tour = mongoose.model("Tour", tourSchema);
//the first argument is the singular name of collection for which this model is for
//and second argument is the name of schema

//let's create a document and save it to collection

let testtour = new Tour({
    name: "The Forest Hiker2",
    rating: 4.7,
    price: 497
});

testtour.save()//this will return a promise
        .then(doc => {
            console.log(doc);
        }).catch(err => {
            console.log("Error", err);
        });

//Above function is to save the document to the connected database;
//this was just our first interaction with our mongodb database
*/
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log("Server has started.");
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandeled Rejections-Shutting Down");
    server.close(() => {
        process.exit(1);
    });
});