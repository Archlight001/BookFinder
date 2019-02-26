//jshint esversion:6
const express = require("express");
const bodyparser= require("body-parser");
const ejs = require("ejs");
const request = require("request");

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("index");
});


app.post("/", function(req,res){
    let add = "inauthor: keyes";
    let book = req.body.bookName;
    let apikey = "AIzaSyBlMHwsQcbELA3y4gs8ejrcm2RLm1AN9cg";
    //let baseURL = "https://www.googleapis.com/books/v1/volumes?q="+book+"&key="+apikey;
    let options ={
        url: "https://www.googleapis.com/books/v1/volumes",
        method: "GET",
        qs : {
            q: book,
            maxResults: 40,
            key: apikey
        }
    };

    request(options, function(err,response,result){
        let y = JSON.parse(result);
        res.send(result);
        console.log(Object.keys(y.items).length);
        // for(x=0;x<40;x++){
        // console.log(y.items[x].volumeInfo.title); 
        // }
    });
});

app.listen(3000, function() {
   console.log("Server has started on post 3000"); 
});