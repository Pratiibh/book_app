'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

// Set the view engine for server-side templating
app.set('view-engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', (request, response) => {
  response.render('pages/index.ejs');
})

app.get('/hello', (request, response) => {
  response.render('pages/index.ejs');
})

// Creates a new search to the Google Books API
app.post('/searches', (request, response) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=+intitle:${request.body.search[0]}`).then(result => {
    // console.log(result.body);

    response.send(result.body.items[0].volumeInfo.title);
    // book_array = new Book_input(result.body.items[0])
    let test = result.body.items.map(build_book_display);
    console.log(test);
    response.send(test);

  })
  // console.log(request.body);
})

// Catch-all

// HELPER FUNCTIONS
function build_book_display(val){
  let book_object = new Book_input(val)
  return book_object;
}
// Book constructor

let book_array = [];

function Book_input(book) {
  this.title = book.volumeInfo.title;
  this.authors = book.volumeInfo.authors;
  this.description = book.volumeInfo.description;
  this.image_link = book.volumeInfo.imageLinks.thumbnail.slice(0,4) + "s" + book.volumeInfo.imageLinks.thumbnail.slice(4)
  book_array.push(this);
}

// No API key required
// Console.log request.body and request.body.search

// console.log(book_array);

app.listen(PORT, () => console.log('app is up on port ' + PORT));
