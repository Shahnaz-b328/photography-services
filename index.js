const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmexp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("PhotoGraphy").collection("services");
  const ordersCollection = client.db("PhotoGraphy").collection("orders");
  const addAdmin = client.db("PhotoGraphy").collection("admin");
  app.post('/addService', (req, res) => {
      const newService = req.body;
      console.log(newService)
      servicesCollection.insertOne(newService)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/services', (req, res) => {
    servicesCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.get('/services/:title', (req, res) => {
    servicesCollection.find({ title: req.params.title })
      .toArray((err, collection) => {
        res.send(collection[0])
      })

  })
  app.post('/addOrder', (req, res) => {
    order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/order', (req, res) => {
    ordersCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.delete('/delete/:title', (req, res) => {
    servicesCollection.deleteOne({ title: (req.params.title) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    console.log(admin)
    addAdmin.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/admins', (req, res) => {
    addAdmin.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    addAdmin.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
      })
  })
  console.log('database connected successfully')
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)