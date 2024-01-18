const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const warehousesRouter = require('./routes/warehouses');
app.use('/api/warehouses', warehousesRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


