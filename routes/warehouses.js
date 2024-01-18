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

module.exports = router;
