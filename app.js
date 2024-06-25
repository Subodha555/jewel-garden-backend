const express = require('express');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

require('dotenv/config');

// const authJwt = require('./helpers/jwt');
// const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*',cors());

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
// app.use(morgan('tiny'));
// app.use(authJwt());
// app.use('/public/uploads', express.static( __dirname + '/public/uploads'));
// app.use(errorHandler);

const api = process.env.API_URL;
// const categoriesRoute = require('./routes/categories');
const productRoute = require('./routes/sample-products');
// const userRoute = require('./routes/users');
// const orderRoute = require('./routes/orders');

// Routes

app.use(`${api}/products`, productRoute);
// app.use(`${api}/categories`, categoriesRoute);
// app.use(`${api}/users`, userRoute);
// app.use(`${api}/orders`, orderRoute);

const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    // useNewUrlParser: true, // these are deprecatedw
    // useUnifiedTopology: true

}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
//
// // listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
// const { MongoClient, ServerApiVersion } = require('mongodb');
//
// const client = new MongoClient(dbConfig.url, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);





// let rows = 3;
// let count = 0;
//
// for (let i = 1; i < rows + 1; i++) {
//     drawTree(i);
// }
//
// function drawTree (i) {
//     var val = "";
//     for (let y=0; y<i; y++) {
//         val = val + "*";
//     }
//
//     console.log(val);
// }



// let rows = 13;
// let columns = rows + 2;
// let currentColumns  = columns;
//
// for (let i=1; i<rows+1; i++) {
//     let tempVal = "";
//     let diff = columns - currentColumns;
//     for (let c=1; c<columns+1; c++) {
//         if (diff > 0) {
//             let spacePlaces = diff/2;
//             let spaceIndexes = [];
//
//             for (let z =1; z< spacePlaces+1; z++) {
//                 spaceIndexes.push(z);
//             }
//
//             for (let z =1; z< spacePlaces+1; z++) {
//                 spaceIndexes.push(columns+1 - z);
//             }
//
//
//             if (spaceIndexes.includes(c)) {
//                 tempVal = tempVal + " "
//             } else {
//                 tempVal = tempVal+"*";
//             }
//         } else {
//             tempVal = tempVal+"*";
//         }
//     }
//
//     console.log(tempVal);
//
//     currentColumns = currentColumns - 2;
// }