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


route.post('/', async (req, res) => {
  const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email
  } = req.body;

  if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
    return res.status(400).json({ message: "All fields are required." });
}

  try {
      const [newWarehouseId] = await knex('warehouses').insert({
          warehouse_name,
          address,
          city,
          country,
          contact_name,
          contact_position,
          contact_phone,
          contact_email
      }).returning('id');

      const newWarehouse = await knex('warehouses').where({ id: newWarehouseId }).first();
      res.status(201).json(newWarehouse);
  } catch (error) {
      res.status(500).json({ message: "Error creating warehouse", error: error.message });
  }
});


module.exports = route;
