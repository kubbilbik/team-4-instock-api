const knex = require("knex")(require("../knexfile"));
const route = require("express").Router();

route.get("/", async (_req, res) => {
  try {
    const inventories = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select("inventories.*", "warehouses.warehouse_name");
    res.json(inventories);
  } catch (error) {
    res.status(404).json({ error: true, message: "Could not fetch inventories from the database" });
  }
});

route.get("/:id", async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const inventory = await knex("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
      .select("inventories.*", "warehouses.warehouse_name")
      .where("inventories.id", inventoryId)
      .first();

    if (!inventory) {
      return res.status(404).json({
        error: true,
        message: `Could not find inventory with ID: ${inventoryId}`,
      });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: true, message: `Could not fetch inventory ${inventoryId}` });
  }
});



route.post("/", async (req, res) => {
	try {
		const newInventoryItemIDs = await knex("inventories").insert(req.body);
		res.status(201).json(newInventoryItemIDs);
	} catch (error) {
		res
			.status(400)
			.json({ message: `Error adding a new inventory item: ${error.message}` });
	}
});

module.exports = route;

