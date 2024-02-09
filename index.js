//MAIN BACKEND FILE
const db = require("./database/index.js");
const BookModel = require("./database/books.js");

const express = require("express");
const app = express();
app.use(express.json());


                ////// THE CORRECT CONNECTION WITH MY MONGODB VERSION /////
/*const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://PaulBilal:<password>@cluster0.wpagn55.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/

//Import the mongoose module
var mongoose = require('mongoose');
//Set up the default mongoose connection
var mongoDB = 'mongodb+srv://PaulBilal:c00kies&M!lk@cluster0.wpagn55.mongodb.net/book-company?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("CONNECTION ESTABLISHED"));

/*const uri = "mongodb+srv://PaulBilal:c00kies&M!lk@cluster0.wpagn55.mongodb.net/book-company?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
    const bcollection = client.db("book-company").collection("books").findOne({ISBN: "1234Three"});
    bcollection.then((data)=>console.log(data)).catch((err)=>console.log(err));
    client.close();
});*/

/*async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();   // A default which lists all the databases for you
    console.log("THE DATABASES ARE:");
    databasesList.databases.forEach(db => console.log(db.name));
}*/

/*async function main() {
    const uri = "mongodb+srv://PaulBilal:c00kies&M!lk@cluster0.wpagn55.mongodb.net/book-company?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    try {
        await client.connect();
        const result = await client.db("book-company").collection("books").findOne({ISBN: "1234Three"});
        console.log(result);
        //await listDatabases(client);
    }
    catch(err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}

main();*/


// http://localhost:3000/
app.get("/", (req, res) => {
    return res.json({"WELCOME": `to my Backend Software for the Book Company`});
})

// http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);  // Can also use res.send(getAllBooks), it yields the same results, but first preference is res.json
})

// http://localhost:3000/book-isbn/1234Three
app.get("/book-isbn/:isbn", async (req, res) => {
    //console.log(req, params);
    const {isbn} = req.params; //easier way is const isbn = req.params.isbn
    //console.log(isbn);
    const getSpecificBook = await BookModel.findOne({ISBN: isbn});
    //console.log(getSpecificBook);
    //console.log(getSpecificBook.length);
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook);
})

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    //console.log(req, params);
    const {category} = req.params; //easier way is const isbn = req.params.isbn
    //console.log(isbn);
    const getSpecificBooks = await BookModel.find({category:category});
    //console.log(getSpecificBook);
    //console.log(getSpecificBook.length);
    if(getSpecificBooks.length===0) {
        return res.json({"error": `No Books found for the category of ${category}`});
    }
    return res.json(getSpecificBooks);
})

// http://localhost:3000/authors
app.get("/authors", (req, res) => {
    const getAllAuthors = db.authors;
    return res.json(getAllAuthors);
});

// http://localhost:3000/author-id/1
app.get("/author-id/:id", (req, res) => {
    //console.log(req, params);
    let {id} = req.params; //easier way is const isbn = req.params.isbn
    id = Number(id);
    //console.log(id);
    const getSpecificAuthor = db.authors.filter((author) => author.id === id);
    //console.log(getSpecificAuthor);
    //console.log(getSpecificAuthor.length);
    if(getSpecificAuthor.length===0) {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    return res.json(getSpecificAuthor[0]);
})

// http://localhost:3000/author-isbn/12345TWO
app.get("/author-isbn/:isbn", (req, res) => {
    console.log(req, params);
    const {isbn} = req.params; //easier way is const isbn = req.params.isbn
    //id = Number(id);
    //console.log(id);
    const getSpecificAuthors = db.authors.filter((author) => author.books.includes(isbn));
    if(getSpecificAuthors.length===0) {
        return res.json({"error": `No Author found for the isbn of ${isbn}`});
    }
    return res.json(getSpecificAuthors);
});

// http://localhost:3000/publications
app.get("/publications", (req, res) => {
    const getAllPublications = db.publications;
    return res.json(getAllPublications);
})

// http://localhost:3000/publication-isbn/12345TWO
app.get("/publicatio-isbn/:isbn", (req, res) => {
    //console.log(req, params);
    //let {id} = req.params; //easier way is const isbn = req.params.isbn
    //id = Number(id);
    //console.log(id);
    //const getSpecificAuthor = db.authors.filter((author) => author.id === id);
    //console.log(getSpecificAuthor);
    //console.log(getSpecificAuthor.length);
    //if(getSpecificAuthor.length===0) {
      //  return res.json({"error": `No Author found for the id of ${id}`});
    //}
  //  return res.json(getSpecificAuthor[0]);
});

// http://localhost:3000/book
app.post("/book", async (req, res) => {
    //console.log(req.body);
    const addNewBook = await BookModel.create(req.body);
    return res.json({
        bookAdded: addNewBook,
        message: "Book was added !!!"
    });
}); 

// http://localhost:3000/author
app.post("/author", (req, res) => {
    //console.log(req.body);
    db.authors.push(req.body);
    return res.json(db.authors);
}); 

// http://localhost:3000/publications
app.post("/publications", (req, res) => {
    //console.log(req.body);
    db.publications.push(req.body);
    return res.json(db.publications);
}); 

// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", (req, res) => {
    //console.log(req.body);
    //console.log(req.params);
    const {isbn} = req.params;
    db.books.forEach((book) => {
        if(book.ISBN === isbn) {
            //console.log({...book, ...req.body})
            return {...book, ...req.body};
        }
        return book;
    });
    return res.json(db.books);
});

// http://localhost:3000/author-update/1                        //NEEDS TO BE COMPLETED
app.put("/author-update/:id", (req, res) => {
    //console.log(req.body);
    console.log(req.params);
    const {id} = req.params;
    db.authors.forEach((author) => {
        if(author.id === id) {
            console.log({...author, ...req.body})
            return {...author, ...req.body};
        }
        return author;
    });
    return res.json(db.authors);
});

// http://localhost:3000/publication-update/1                //NEEDS TO BE COMPLETED
app.put("/publication-update/:isbn", (req, res) => {
    //console.log(req.body);
    console.log(req.params);
    const {isbn} = req.params;
    db.books.forEach((book) => {
        if(book.ISBN === isbn) {
            console.log({...book, ...req.body})
            return {...book, ...req.body};
        }
        return book;
    });
    return res.json(db.books);
});

// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", (req, res) => {
    //console.log(req.params);
    const {isbn} = req.params;
    const filteredBooks = db.books.filter((book) => book.ISBN!==isbn);
    //console.log(filteredBooks);
    db.books = filteredBooks;
    return res.json(db.books)
});

// http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", (req, res) => {
    //console.log(req.params);
    let {isbn, id} = req.params;
    id = Number(id);
    db.books.forEach((book) => {
        if(book.ISBN === isbn) {
            if(!book.authors.includes(id)) {
                return;
            }
            book.authors = book.authors.filter((author) => author!==id);
            return book;
        }
        return book;
    });
    return res.json(db.books)
});


app.listen(3000, () => {
    console.log("MY EXPRESS APP IS RUNNING...");
});