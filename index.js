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
        const blogsCollection = database.collection("blogs");

        // GET FOODS API 
        app.get('/foods', async (req, res) => {
            const cursor = foodsCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET PLACE ORDER API
        app.get('/placedOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

        // GET BLOGS API
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
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

        // POST FOODS API
        app.post('/foods', async (req, res) => {
            const result = await foodsCollection.insertOne(req.body);
            res.send(result)
        })

        // POST PLACED ORDER API
        app.post('/placedOrder', async (req, res) => {
            const result = await orderCollection.insertOne(req.body);
            res.send(result)
        })

        // POST BLOGS API
        app.post('/blogs', async (req, res) => {
            const result = await blogsCollection.insertOne(req.body);
            res.send(result)
        })


        // UPDATE PLACED ORDER APPROVE STATUS 
        app.put('/placedOrder/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const updateOrderStatus = req.body;
            const updateDoc = {
                $set: {
                    status: updateOrderStatus.status
                }
            };

            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result)
        });

        // UPDATE BLOGS APPROVE STATUS
        app.put('/blogs/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const updateBlogStatus = req.body;
            const updateDoc = {
                $set: {
                    status: updateBlogStatus.status
                }
            };

            const result = await blogsCollection.updateOne(query, updateDoc);
            res.send(result)
        });

        // DELETE API
        app.delete('/placedOrder/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
        });

        // DELETE BLOG API
        app.delete('/blogs/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) }
            const result = await blogsCollection.deleteOne(query)
            res.send(result)
        });

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