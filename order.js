const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27017';
const dbName = 'order_dashboard';
const collectionName = 'orders'; 
app.use(bodyParser.json());
app.post('/api/orders', async (req, res) => {
    const orderData = req.body;
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(orderData);
        console.log(`Order inserted with _id: ${result.insertedId}`);

        res.status(201).json({ message: 'Order inserted successfully' });
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.close();
    }
});
app.get('/api/orders', async (req, res) => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const orders = await collection.find({}).toArray();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.close();
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});