import db from "../db.js";
import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string(),
    stockTotal: Joi.number().integer().min(1).required(),
    pricePerDay: Joi.number().integer().min(1).required(),
    categoryId: Joi.number().integer()
})

/////////////games////////////
export async function getGames (req, res) {
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
}

export async function postGames (req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    try {
        const { error } = schema.validate( {name, image, stockTotal, categoryId, pricePerDay} );
        const categorieId = await db.query(`SELECT id FROM categories`);
        if (error || !categorieId.rows.some(el => el.id == categoryId)) 
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
}
