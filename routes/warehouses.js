const knex = require("knex")(require("../knexfile"));
const route = require("express").Router();

route.get("/", async (req, res) => {
	try {
		const warehouses = await knex.select("*").from("warehouses");
		res.status(200).json(warehouses);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error retrieving warehouses", error: error.message });
	}
});

// GET a single warehouse by ID
route.get('/:id', async (req, res) => {
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



route.put("/:id", async (req, res) => {
	try {
		const updatedWarehouseData = req.body;
		const warehouseIDToUpdate = req.params.id;
		await knex("warehouses")
			.where({ id: warehouseIDToUpdate })
			.update(updatedWarehouseData);
		res.json(updatedWarehouseData);
	} catch (error) {
		res.status(400).json({
			message: `Error updating warehouse with ID ${warehouseIDToUpdate}: ${error.message}`,
		});
	}
});

route.delete("/:id", async (req, res) => {
	try {
		const warehouseIDToDelete = req.params.id;
		await knex("warehouses").where({ id: warehouseIDToDelete }).del();
	} catch (error) {
		res.status(400).json({
			message: `Error deleting warehouse with ID ${warehouseIDToDelete}: ${error.message}`,
		});
	}
});

module.exports = route;
