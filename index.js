const express = require('express');
const cors = require('cors');
const knex = require("knex")(require("./knexfile"));
const PORT = process.env.PORT || 8080;


const app = express();

app.use(cors());
app.use(express.json());


const inventoryRoutes = require('./routes/inventory');


app.use('/inventories', inventoryRoutes);


app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
  });  