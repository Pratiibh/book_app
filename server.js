'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
// const methodOverride = require('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Setup client to talk to pg
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

// // look in the urlencoded POST body and delete _method then change to a put
// app.use(methodOverride((request, response) => {
//   if(request.body && typeof request.body === 'object' && '_method' in request.body) {
//     let method = request.body._method; // 'PUT';
//     delete request.body._method;
//     return method; // 'PUT'
//   }
// }))

// SQL commands
const SQL = {};
SQL.getAllData = 'SELECT * FROM book_app;';
SQL.idCheck = 'SELECT * FROM book_app WHERE id=$1;';

// Application Middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

// Set the view engine for server-side templating
app.set('view-engine', 'ejs');

// API Routes
// Renders the search form
app.get('/', (request, response) => {
  client.query(SQL.getAllData).then(result => {
    // console.log(testSelected);
    console.log(result.rows)
    response.render('pages/index.ejs', {testing:result.rows});
  })
})

// Creates a new search to the Google Books API
app.post('/bookshelf', (request,response) => {
  console.log('attempt to post');
  console.log(request.body);

  const {title, authors, image_link, description, isbn, bookshelf} = request.body;

  const sql = 'INSERT INTO book_app (title, authors, description, image_link, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6)'
  client.query(sql, [title, authors, description, image_link, isbn, bookshelf])

  // response.render('/searches/addBook.ejs')
  response.redirect('/');
})


app.get('/new', (request, response) => {
  response.render('pages/new.ejs')
})

app.get('/details/:id', (request, response) => {
  const testSelected = request.params.id //parseInt(request.params.id)
  client.query(SQL.idCheck, [testSelected]).then(result => {
    response.render('pages/details.ejs', {testing:result.rows[0]});
  })
})

app.post('/searches', (request, response) => {
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=+intitle:${request.body.search[0]}`).then(result => {
    // console.log(result.body);
    // response.send(result.body.items[0].volumeInfo.title);
    // response.send(result.body.items);
    // book_array = new Book_input(result.body.items[0])
    if(result.body.totalItems === 0){
      let fail = 'The book you have searched for was not found by the API!'
      response.render('pages/searches/error.ejs',{fail})
    } else {
      let test = result.body.items.map(build_book_display);
      response.render('pages/searches/show.ejs',{data:test});
      // code for add to database
    }
  })
    .catch(err => {
      console.log(err)
      response.render('pages/searches/APIerror.ejs',{error: err})
    })
  // console.log(request.body);
})

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
  this.image_link = book.volumeInfo.imageLinks.thumbnail.slice(0,4) + 's' + book.volumeInfo.imageLinks.thumbnail.slice(4)
  this.ISBN = book.volumeInfo.industryIdentifiers.identifier;
  book_array.push(this);
}

// below test renders page
app.get('/test', (request, response) => {
  response.render('pages/index.ejs');
});

// No API key required
// Console.log request.body and request.body.search
// console.log(book_array);

app.listen(PORT, () => console.log('app is up on port ' + PORT));
