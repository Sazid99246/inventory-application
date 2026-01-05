const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const inventoryRouter = Router();

inventoryRouter.get("/", categoryController.getAllCategories);
inventoryRouter.get("/create", categoryController.createCategoryGet);
inventoryRouter.post("/create", categoryController.createCategoryPost);
inventoryRouter.get("/:id", categoryController.getCategoryItems);
inventoryRouter.get("/:id/update", categoryController.updateCategoryGet);
inventoryRouter.post("/:id/update", categoryController.updateCategoryPost);
inventoryRouter.post("/:id/delete", categoryController.deleteCategoryPost);

module.exports = inventoryRouter;