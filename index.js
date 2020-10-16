const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const cors = require('cors');
require('dotenv').config()
const fileUpload = require('express-fileupload')
const port = 5000

const app = express()
app.use(express.static('service'))
app.use(fileUpload());
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jkj2o.mongodb.net/CreativeAgency?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("CreativeAgency").collection("orderData");
  const reviewCollection = client.db("CreativeAgency").collection("reviewData");
  const serviceCollection = client.db("CreativeAgency").collection("AddService");
  const adminCollection = client.db("CreativeAgency").collection("makeAdmin");

  app.post("/addOrders", (req, res) =>{
    const orders = req.body;
    console.log(orders);
    orderCollection.insertOne(orders)
    .then( result => {
      res.send(result)
    })
  })

  app.get('/showOrder', (req, res) =>{
    orderCollection.find({email: req.query.email})
    .toArray((err, document) => {
      res.send(document);
    })
  })

  app.get('/AdminShowOrder', (req, res) =>{
    orderCollection.find({})
    .toArray((err, document) => {
      res.send(document);
    })
  })

  app.post("/addReview", (req, res) =>{
    const orders = req.body;
    console.log(orders);
    reviewCollection.insertOne(orders)
    .then( result => {
      res.send(result)
    })
  })
  app.post("/addService", (req, res) =>{
    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
      const newImg = file.data;
      const encImg = newImg.toString('base64');

      const image ={
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from (encImg, 'base64')
      };

      serviceCollection.insertOne({name, description, image})
      .then( result => {
        fs.remove(filePath, error =>{
          if(error) {console.log(error)}
          res.send(result.insertedCount > 0)
        })
      
    })
  })

  app.post("/addOrder", (req, res) =>{
    const file = req.files.file;
    const name = req.body.name;
    const servics = req.body.servics;
    const message = req.body.message;
      const newImg = file.data;
      const encImg = newImg.toString('base64');

      const image ={
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
      };

      orderCollection.insertOne({name, servics, message, image})
      .then( result => {
          res.send(result.insertedCount > 0)
        })
    
  })

  app.post("/addReview", (req, res) =>{
    const file = req.body.image;
    const name = req.body.name;
    const designation = req.body.designation;
    const message = req.body.message;
    console.log(file, name, designation, message)
      reviewCollection.insertOne({name, designation, message, image})
      .then( result => {
        res.send(result.insertedCount > 0)
      
      })
  

  })

  app.get('/getService', (req, res) =>{
    serviceCollection.find({})
    .toArray((err, document) => {
      res.send(document);
    })
  })
  app.get('/getFeedback', (req, res) =>{
    reviewCollection.find({})
    .toArray((err, document) => {
      res.send(document);
    })
  })

  app.post("/makeAdmin", (req, res) =>{
    const admin = req.body;
    console.log(admin);
    adminCollection.insertOne(admin)
    .then( result => {
      res.send(result)
    })
  })

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
    .toArray((err, admins) => {
      res.send(admins.length > 0);
    })
  })

});
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)