const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

const warehousesRouter = require("./routes/warehouses");
const inventoryRouter = require('./routes/inventory');

app.use(cors());
app.use(express.json());

app.use('/api/inventories', inventoryRouter);
app.use("/api/warehouses", warehousesRouter);

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));
