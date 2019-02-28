//jshint esversion:6
const express = require("express");
const bodyparser= require("body-parser");
const ejs = require("ejs");
const request = require("request");

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

let bookData = [];

app.get("/", function(req,res){
    res.render("index", {
        Set : "Unset",
        SearchTitle:"",
        SearchAuthor:""
    });
});



app.post("/", function(req,res){
    let add = "inauthor: keyes";
    let book = req.body.bookName;
    let author = req.body.bookAuthor;
    let qvalue;
    if(author === ""){
        qvalue = book + "+intitle:" + book;
    }else{
        qvalue = book + "+inauthor:"+author;
    }

    let apikey = "AIzaSyBlMHwsQcbELA3y4gs8ejrcm2RLm1AN9cg";
    //let baseURL = "https://www.googleapis.com/books/v1/volumes?q="+book+"&key="+apikey;
    let options ={
        url: "https://www.googleapis.com/books/v1/volumes",
        method: "GET",
        qs : {
            q: qvalue,
            maxResults: 40,
            key: apikey
        }
    };

    request(options, function(err,response,result){
        //res.send(result);
        let bookResult = JSON.parse(result);
        let totalBooks = Object.keys(bookResult.items).length;
        
        
        for(x=0;x<totalBooks;x++){
            let bookTitle="";
            let bookDescription ="";
            let bookAuthor ="";
            let bookPublisher ="";
            let bookImageURL = "";
            let bookMoreInfo ="";
            if (typeof bookResult.items[x].volumeInfo.title === "undefined"){
                bookTitle ="No Title";     
            }else{
             bookTitle =bookResult.items[x].volumeInfo.title;
            }
            if (typeof bookResult.items[x].volumeInfo.description === "undefined") {
                bookDescription = "No Description";
            } else {
                bookDescription = bookResult.items[x].volumeInfo.description;
            }
             if (typeof bookResult.items[x].volumeInfo.authors === "undefined"){
                bookAuthor = "No Author";
            }else{
                bookAuthor = bookResult.items[x].volumeInfo.authors[0];
            }
            if (typeof bookResult.items[x].volumeInfo.publisher === "undefined"){
                bookPublisher = "No publisher";
            }else {
                 bookPublisher = bookResult.items[x].volumeInfo.publisher;
            }
            if (typeof bookResult.items[x].volumeInfo.imageLinks === "undefined"){
                bookImageURL = "No Image";
            }else {
                bookImageURL = bookResult.items[x].volumeInfo.imageLinks.thumbnail;
            }
            if (typeof bookResult.items[x].volumeInfo.infoLink === "undefined") {
                bookMoreInfo = "";
            } else {
                bookMoreInfo = bookResult.items[x].volumeInfo.infoLink;
            }

            let book = {
                Title : bookTitle,
                Description: bookDescription,
                Author : bookAuthor,
                Publisher: bookPublisher,
                Image : bookImageURL,
                InfoLink: bookMoreInfo
            };
            bookData.push(book);
            
        }
       // console.log(bookData);
        
        res.render("index",{
            Set : "Set",
            Book: bookData,
            SearchTitle: book,
            SearchAuthor: author
        });
        bookData = [];
        
    });
});

app.listen(5000, function() {
   console.log("Server has started on post 5000"); 
});