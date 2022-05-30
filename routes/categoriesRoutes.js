import { Router } from "express";

import { getCategories, postCategories } from "../controllers/catregoriesControllers.js";

const categoriesRoutes = Router();

categoriesRoutes.post('/categories', postCategories);
categoriesRoutes.get('/categories', getCategories);

export default categoriesRoutes;