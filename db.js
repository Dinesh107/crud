const mongodb = require('mongodb');

// below line using for - using all mongodb methods using mongoclient. 
const MongoClient = mongodb.MongoClient;

const ObjectID = mongodb.ObjectId;

let database;

// below function is asynchronous function because this function will perform delayed operations
async function getDatabase() {
     //this is connection string with db 
     const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
     database = client.db('library'); // the parameter is database name
     
     if(!database) {
        console.log('database not connected');
     }

     return database;

}

module.exports = {
    getDatabase, 
    ObjectID,
}
