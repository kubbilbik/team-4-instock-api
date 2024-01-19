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
  const inventoryDataToValidate = ["warehouse_id", "item_name", "description", "category", "status", "quantity"];
	try {
    const newInventoryData = req.body;

    const newInventoryDataKeys = Object.keys(newInventoryData);
    const doesAllDataExist = inventoryDataToValidate.every((prop) => newInventoryDataKeys.includes(prop));
    if (!doesAllDataExist) {
      return res.status(400).json({ message: "Missing properties in the request body" });
    }

    const doesWarehouseIDExist = await knex("warehouses").where({ id: newInventoryData.warehouse_id }).first();
    if (!doesWarehouseIDExist) {
      return res.status(400).json({ message: `Invalid or non-existent warehouse ID: ${newInventoryData.warehouse_id}` });
    }
    const isQuantityANumber = !Number.isNaN(newInventoryData.quantity);
    if (!isQuantityANumber) {
      return res.status(400).json({ message: `Quantity of ${newInventoryData.quantity} is not a valid entry` });
    }

		const newInventoryItemIDs = await knex("inventories").insert(newInventoryData);
		res.status(201).json(newInventoryItemIDs);
	} catch (error) {
		res
			.status(400)
			.json({ message: `Error adding a new inventory item: ${error.message}` });
	}
});


route.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouse_id, item_name, description, category, status, quantity } = req.body;

    
    if (![warehouse_id, item_name, description, category, status, quantity].every(prop => prop !== undefined)) {
      return res.status(400).json({ message: "Missing properties in the request body" });
    }

    
    if (isNaN(quantity)) {
      return res.status(400).json({ message: `Quantity of ${quantity} is not a valid entry` });
    }

    
    const warehouseExists = await knex("warehouses").where({ id: warehouse_id }).first();
    if (isNaN(warehouse_id) || !warehouseExists) {
      return res.status(400).json({ message: `Invalid or non-existent warehouse ID: ${warehouse_id}` });
    }

    
    const updateData = {
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity: parseInt(quantity),
    };

    const updatedRows = await knex("inventories").update(updateData).where({ id });

    
    if (updatedRows === 0) {
      return res.status(404).json({ message: `Inventory with ID of ${id} does not exist, update failed` });
    }

    res.status(200).json({
      id,
      ...updateData,
    });
  } catch (error) {
    console.error("Error updating Inventory Item:", error);
    res.status(400).json({ message: `Error updating Inventory Item ${req.params.id}: ${error.message}` });
  }
});


route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    
    await knex("inventories").where({ id }).delete();

    res.status(200).send(`Inventory item with id: ${id} has been deleted`);
  } catch (error) {
    res.status(404).send(`Could not delete inventory item ${req.params.id}. ${error}`);
  }
});


module.exports = route;

