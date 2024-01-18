const express = require('express');
const cors = require('cors');
require("dotenv").config()
const warehousesRouter = require('./routes/warehouses')
const PORT = process.env.PORT || 8080

const app = express();

app.use(cors());
app.use(express.json());

app.use('/warehouses', warehousesRouter)

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`))