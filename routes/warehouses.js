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
route.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const warehouse = await knex("warehouses").where({ id }).first();
		if (!warehouse) {
			return res.status(404).json({ message: "Warehouse not found" });
		}
		res.status(200).json(warehouse);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error retrieving warehouse", error: error.message });
	}
});

route.get("/:id/inventories", async (req, res) => {
	try {
		const { id } = req.params;

		const warehouseExists = await knex("warehouses").where({ id }).first();
		if (!warehouseExists) {
			return res
				.status(404)
				.json({ message: `Warehouse with ID ${id} not found` });
		}

		const inventoryItems = await knex("inventories")
			.where({ warehouse_id: id })
			.select("id", "item_name", "category", "status", "quantity");

		res.status(200).json(inventoryItems);
	} catch (error) {
		console.error("Error fetching inventory items:", error);
		res.status(500).json({ message: "Error fetching inventory items" });
	}
});

route.put("/:id", async (req, res) => {
  try {
      const updatedWarehouseData = req.body;
      const warehouseIDToUpdate = req.params.id;
      
       
      const { warehouse_name, address, city, country, contact_name, contact_position, contact_phone, contact_email } = updatedWarehouseData;

       
      await knex("warehouses")
          .where({ id: warehouseIDToUpdate })
          .update({
              warehouse_name,
              address,
              city,
              country,
              contact_name,
              contact_position,
              contact_phone,
              contact_email
          });

      res.json(updatedWarehouseData);
  } catch (error) {
      res.status(400).json({
          message: `Error updating warehouse with ID ${req.params.id}: ${error.message}`,
      });
  }
});


route.delete("/:id", async (req, res) => {
	try {
		const warehouseIDToDelete = req.params.id;
		await knex("warehouses").where({  id: warehouseIDToDelete }).delete();
    res.sendStatus(204); 
    }
	 catch (error) {
		res.status(400).json({
			message: `Error deleting warehouse with ID ${warehouseIDToDelete}: ${error.message}`,
		});
	}
});

route.post("/", async (req, res) => {
	const isValidEmail = (email) => {
		return email.includes("@") && email.includes(".");
	};

	const {
		warehouse_name,
		address,
		city,
		country,
		contact_name,
		contact_position,
		contact_phone,
		contact_email,
	} = req.body;

	if (
		!warehouse_name ||
		!address ||
		!city ||
		!country ||
		!contact_name ||
		!contact_position ||
		!contact_phone ||
		!contact_email
	) {
		return res.status(400).json({ message: "All fields are required." });
	}

	if (!isValidEmail(contact_email)) {
		return res.status(400).json({ message: "Invalid email address." });
	}

	try {
		const [newWarehouseId] = await knex("warehouses")
			.insert({
				warehouse_name,
				address,
				city,
				country,
				contact_name,
				contact_position,
				contact_phone,
				contact_email,
			})
			.returning("id");

		const newWarehouse = await knex("warehouses")
			.where({ id: newWarehouseId })
			.first();
		res.status(201).json(newWarehouse);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error creating warehouse", error: error.message });
	}
});

module.exports = route;
