import express, { json } from "express";
import cors from 'cors';
import db from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());

////////////categories////////////
app.get('/categories', async (req, res) => {
    try {
        const categories = await db.query(`SELECT * FROM categories`);
        console.log(categories.rows);
        res.status(200).send(categories.rows);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
})

app.post('/categories', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.sendStatus(400);
    try {
        const categories = await db.query(`SELECT name FROM categories`);
        if (categories.rows.some(el => el.name.toUpperCase() == name.toUpperCase()))
            return res.sendStatus(409);
        await db.query(`INSERT INTO categories (name) VALUES ('${name}')`);
        console.log(categories.rows);
        res.sendStatus(201);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
})

app.listen(process.env.PORT, () => {
    console.log("server on");
})