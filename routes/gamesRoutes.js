import { Router } from "express";

import { getGames, postGames } from "../controllers/gamesControllers.js";

const gamesRoutes = Router();

gamesRoutes.post('/games', postGames);
gamesRoutes.get('/games', getGames);

export default gamesRoutes;