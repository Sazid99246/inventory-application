const { Router } = require("express");

const itemRouter = Router();

const itemController = require("../controllers/itemController");

itemRouter.get("/create", itemController.createItemGet);
itemRouter.post("/create", itemController.createItemPost);
itemRouter.post("/:id/delete", itemController.deleteItemPost);
itemRouter.get("/:id/update", itemController.updateItemGet);
itemRouter.post("/:id/update", itemController.updateItemPost);

module.exports = itemRouter;