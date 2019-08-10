//const app = require("./app");
const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({path: "./../config.env"});
const Tour = require("./../models/tourModel");
const Review = require("./../models/reviewModel");
const User = require("./../models/userModel");

console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
console.log(DB);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    //console.log(con.connections);
    console.log("DB connections successfull");
});
const newTours = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`));
//console.log(newTours);

const importData = async () => {
    try{
        await User.create(newTours);
        console.log("Data sucessfully loaded")
        process.exit();
    }catch(error){
        console.log(error);
    }
}

//we have made above functiion asynchronous because we are making inserting data into database

const deleteData = async () => {
    try{
        await User.deleteMany();
        console.log("Data deleted sucessfully");
        process.exit();
    }catch(error){
        console.log(error);
    }
}

if(process.argv[2] === "--import"){
    importData();
}else if(process.argv[2] === "--delete"){
    deleteData();
}
console.log(process.argv);