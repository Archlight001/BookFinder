//jshint esversion:6
const express = require("express");
const bodyparser= require("body-parser");
const ejs = require("ejs");
const request = require("request");

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

let bookAuthors = [];
let bookTitle = [];
let bookDescription =[];
let bookPubCompany = [];
let bookImageURL = [];

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
        res.send(result);
        let bookResult = JSON.parse(result);
        let totalBooks = Object.keys(bookResult.items).length;
    
        for(x=0;x<totalBooks;x++){
            if (typeof bookResult.items[x].volumeInfo.title === "undefined"){
                bookTitle.push("No Title");     
            }else{
             bookTitle.push(bookResult.items[x].volumeInfo.title);
            }
            if (typeof bookResult.items[x].volumeInfo.description === "undefined") {
                bookDescription.push("No Description");
            } else {
                bookDescription.push(bookResult.items[x].volumeInfo.description);
            }
             if (typeof bookResult.items[x].volumeInfo.authors === "undefined"){
                bookAuthors.push("No Author");
            }else{
                bookAuthors.push(bookResult.items[x].volumeInfo.authors[0]);
            }
            if (typeof bookResult.items[x].volumeInfo.publisher === "undefined"){
                bookPubCompany.push("No publisher");
            }else {
                 bookPubCompany.push(bookResult.items[x].volumeInfo.publisher);
            }
            if (typeof bookResult.items[x].volumeInfo.imageLinks === "undefined"){
                bookImageURL.push("No Image");
            }else {
                bookImageURL.push(bookResult.items[x].volumeInfo.imageLinks.thumbnail);
            }
            
        }
        console.log(bookDescription);
        
        
        
    });
});

app.listen(5000, function() {
   console.log("Server has started on post 5000"); 
});