const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const warehousesRouter = require('./routes/warehouses');
app.use('/warehouses', warehousesRouter);

const defaultPort = 3306;
const alternativePort = 3000; 
const port = process.env.PORT == defaultPort ? alternativePort : process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
