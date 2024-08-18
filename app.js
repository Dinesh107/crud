const express = require('express');
const app = express();
const bodyParser = require("body-parser"); 
const exhbs = require("express-handlebars");
const dbo = require("./db");
const ObjectID = dbo.ObjectID;
app.engine(
  "hbs",
  exhbs.engine({ layoutsDir: "views/", defaultLayout: "main", extname: "hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(bodyParser.urlencoded({extended: true})); // middeware

// create a route 
app.get("/", async (req, res) => {
 
  let database = await dbo.getDatabase(); //  
  const collection = database.collection('books');
  const cursor = collection.find({});
  let books = await cursor.toArray();



  let message = "testing";
  let edit_id, edit_book;

  if(req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_book = await collection.findOne({_id:new ObjectID(edit_id)})
  }
  if(req.query.delete_id) {
    await collection.deleteOne({_id:new ObjectID(req.query.delete_id)})

    return res.redirect('/?status=3');
  }

  switch (req.query.status) {
    case '1':
        message = "Inserted successfully";
        break;
    case '2':
        message = "Updated successfully";
        break;
    case '3':
        message = "Deleted successfully";
        break;
  
    default:
        break;
  }

  res.render("main", { message, books, edit_id, edit_book });
});


// this is post route 
app.post('/store_book', async (req, res) => {
  let database = await dbo.getDatabase();  
  let collection = database.collection('books');
  
//   we need to get the data from the form so that we need to use body parser

   let book = { title: req.body.title, author: req.body.author}

//    next in below code we need to insert the book data to the collection for that we need going to use insertOne
// insertOne will insert only one data

    await collection.insertOne(book);
    return res.redirect('/?status=1');
  
});

app.post('/update_book/:edit_id', async (req, res) => {
  let database = await dbo.getDatabase();  
  let collection = database.collection('books');
  
//   we need to get the data from the form so that we need to use body parser

   let book = { title: req.body.title, author: req.body.author}
   let edit_id = req.params.edit_id;

//    next in below code we need to insert the book data to the collection for that we need going to use insertOne
// insertOne will insert only one data

    await collection.updateOne({_id: new ObjectID(edit_id)}, {$set:book});
    return res.redirect('/?status=2');
  
});

app.listen(8000, () => {
  console.log("listening to server 8000 port");
});


