const knex = require("knex")(require("../knexfile"))
const route = require("express").Router()

route.put("/:id", async (req, res) => {
    try {
        const updatedWarehouseData = req.body
        const warehouseIDToUpdate = req.params.id
        await knex("warehouses").where({ id: warehouseIDToUpdate }).update(updatedWarehouseData)
        res.json(updatedWarehouseData)
    } catch (error) {
        res.status(400).json({
            message: `Error updating warehouse with ID ${warehouseIDToUpdate}: ${error.message}`
        })
    }
})

route.delete("/:id", async (req, res) => {
    try {
        const warehouseIDToDelete = req.params.id
        await knex("warehouses").where({ id: warehouseIDToDelete }).del()
    } catch (error) {
        res.status(400).json({
            message: `Error deleting warehouse with ID ${warehouseIDToDelete}: ${error.message}`
        })
    }
})

module.exports = route