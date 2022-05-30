import { Router } from "express";

import { getRentals, postRentals, postRentalsId, deleteRentalsId } from "../controllers/rentalsControllers.js";

const rentalsRoutes = Router();

rentalsRoutes.post('/rentals', postRentals);
rentalsRoutes.post('/rentals/:id/return', postRentalsId);
rentalsRoutes.get('/rentals', getRentals);
rentalsRoutes.delete('/rentals/:id', deleteRentalsId);

export default rentalsRoutes;
