const knex = require("knex")(require("../knexfile"));
const route = require("express").Router();

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

module.export = route