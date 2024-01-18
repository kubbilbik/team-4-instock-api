const knex = require("knex")(require("../knexfile"));
const express = require('express');
const router = express.Router();

// GET all warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await knex.select('*').from('warehouses');
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving warehouses", error: error.message });
  }
});

// GET a single warehouse by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const warehouse = await knex('warehouses').where({ id }).first();
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving warehouse", error: error.message });
  }
});



module.exports = router;
