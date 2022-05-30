import express, { json } from "express";
import cors from 'cors';
import db from "./db.js";
import dotenv from "dotenv";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import gamesRoutes from "./routes/gamesRoutes.js";
import customersRoutes from "./routes/customersRoutes.js";
import rentalsRoutes from "./routes/rentalsRoutes.js";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

app.use(categoriesRoutes);
app.use(gamesRoutes);
app.use(customersRoutes);
app.use(rentalsRoutes);

app.listen(process.env.PORT, () => {
    console.log("server on");
})