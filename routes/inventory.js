const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

//GET ALL INVENTORY
router.get("/", async (_req, res) => {
  try {
    const inventories = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select("inventories.*", "warehouses.warehouse_name");

    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: true, message: "Could not fetch inventories from the database" });
  }
});



module.exports = router;