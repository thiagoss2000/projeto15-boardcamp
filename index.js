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

/////////////games////////////
app.get('/games', async (req, res) => {
    const name = req.query.name;
    try {
        let nameGame = null;
        if (name){
            const listGame = await db.query(`SELECT name FROM games`);
            nameGame = listGame.rows.find(el => {
                return el.name.substr(0, name.length).toUpperCase() == name.toUpperCase()       
            })
        }
        const games = await db.query(`
            SELECT games.*, categories.name as "categoryName"
            FROM games
            JOIN categories
            ON games."categoryId" = categories.id        
            ${(nameGame? `WHERE games.name = '${nameGame.name}'` : '')}
        `);
        res.status(200).send(games.rows);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
})

app.post('/games', async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        const categorieId = await db.query(`SELECT id FROM categories`);
        if (!name || stockTotal <= 0 || pricePerDay <= 0 || !categorieId.rows.some(el => el.id == categoryId)) 
            return res.sendStatus(400);
        const nameGames = await db.query(`SELECT name FROM games`);
        if (nameGames.rows.some(a => a.name.toUpperCase() == name.toUpperCase())) 
            return res.sendStatus(409);
        await db.query(`INSERT INTO games 
            (name, image, "stockTotal", "categoryId", "pricePerDay") 
            VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay})`);
        console.log(nameGames.rows);
        res.sendStatus(201);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
})

app.listen(process.env.PORT, () => {
    console.log("server on");
})