const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.maqeo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db("assignment10");
        const foodsCollection = database.collection("foods");
        const orderCollection = database.collection("orders");

        // GET API 
        app.get('/foods', async (req, res) => {
            const cursor = foodsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET APi
        app.get('/placedOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET SINGLE FOOD ITEM
        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const foodItem = await foodsCollection.findOne(query);
            res.send(foodItem)
        })

        // POST API
        app.post('/foods', async (req, res) => {
            const result = await foodsCollection.insertOne(req.body);
            console.log(result);
            res.send(result)
        })

        // POST API
        app.post('/placedOrder', async (req, res) => {
            const result = await orderCollection.insertOne(req.body)
            res.send(result)
        })


        // UPDATE APPROVE STATUS 
        app.put('/placedOrder/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const updateOrderStatus = req.body;
            const updateDoc = {
                $set: {
                    status: updateOrderStatus.status
                }
            };

            const result = await orderCollection.updateOne(query, updateDoc);
            console.log(result);
            res.send(result)
        })

        // DELETE API
        app.delete('/placedOrder/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})