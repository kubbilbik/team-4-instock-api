const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();

const warehousesRouter = require("./routes/warehouses");
const inventoryRouter = require('./routes/inventory');

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/inventories', inventoryRoutes);
app.use("/api/warehouses", warehousesRouter);

app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));
