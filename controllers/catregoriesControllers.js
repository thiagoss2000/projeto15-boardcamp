import db from "../db.js";

////////////categories////////////
export async function getCategories (req, res){
    try {
        const categories = await db.query(`SELECT * FROM categories`);
        res.send(categories.rows);
    } catch (e){
        console.log(e);
        res.sendStatus(500);
    }
}

export async function postCategories (req, res) {
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
        res.sendStatus(500);
    }
}