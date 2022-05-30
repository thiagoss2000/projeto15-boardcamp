import db from "../db.js";
import Joi from "joi";

///////////rentals///////////
export async function getRentals (req, res) {
    const id = req.query.customerId;
    try {
        const rentalsDetails = await db.query(`SELECT 
        rentals.*, 
        customers.name as "customerName", 
        games.name as "gameName", games."categoryId",
        categories.name as "categoryName"
        FROM rentals 
        JOIN customers 
            ON rentals."customerId"=customers.id 
        JOIN games 
            ON rentals."gameId"=games.id
        JOIN categories 
            ON "games"."categoryId"=categories.id
        `);
        let rentalsFilter = [];
        if (id) {
            rentalsFilter = rentalsDetails.rows.filter(el => el.customerId == id);
        } else {
            rentalsFilter = rentalsDetails.rows;
        }
        if (rentalsFilter.length == 0) return res.sendStatus(404);
        const result =  rentalsFilter.map(el => {
            return {            
                    id: el.id,
                    customerId: el.customerId,
                    gameId: el.gameId,
                    rentDate: el.rentDate,
                    daysRented: el.daysRented,
                    returnDate: el.returnDate, 
                    originalPrice: el.originalPrice,
                    delayFee: el.delayFee,
                    customer: {
                     id: el.customerId,
                     name: el.customerName
                    },
                    game: {
                      id: el.gameId,
                      name: el.gameName,
                      categoryId: el.categoryId,
                      categoryName: el.categoryName
                    }
                  }
        })
        console.log(rentalsDetails.rows)
        res.send(result);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}

export async function postRentals (req, res) {
    const { customerId, gameId, daysRented } = req.body;
    try {
        const details = await db.query(`SELECT 
            games."pricePerDay", games."stockTotal"
            FROM customers, games 
            WHERE games.id = ${gameId} and customers.id = ${customerId}
        `)
        const rentals = await db.query(`SELECT "gameId" FROM rentals WHERE "gameId" = ${gameId}`)
        if (details.rows.length == 0 || rentals.rows.length >= details.rows[0].stockTotal || parseInt(daysRented) <= 0) 
            return res.sendStatus(400);
        await db.query(`INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") 
            VALUES (
                ${customerId}, 
                ${gameId}, 
                TO_DATE('${new Date().toISOString()}', 'YYYY/MM/DD'), 
                ${parseInt(daysRented)},
                ${(details.rows[0].pricePerDay) * parseInt(daysRented)}
            )`);
        res.sendStatus(200);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}

export async function postRentalsId (req, res) {
    const id = req.params.id;
    try {
        const details = await db.query(`SELECT
            "daysRented", "rentDate", "returnDate", games."pricePerDay" FROM rentals JOIN games 
            ON rentals."gameId"=games.id WHERE rentals.id = ${id}
        `)
        if(details.rows.length == 0) return res.sendStatus(404);
        if(details.rows[0].returnDate != null) return res.sendStatus(400);
        let days = (new Date().getDay() - details.rows[0].rentDate.getDay()) - details.rows[0].daysRented;
        if (days < 0) days = 0;
        await db.query(`UPDATE rentals SET
                "returnDate" = TO_DATE('${new Date().toISOString()}', 'YYYY/MM/DD'),
                "delayFee" = '${details.rows[0].pricePerDay * days}'
            WHERE id = ${id}`);
        res.sendStatus(200);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}

export async function deleteRentalsId (req, res) {
    const id = req.params.id;
    try {
        const details = await db.query(`SELECT
            "returnDate" FROM rentals WHERE rentals.id = ${id}
        `);
        if(details.rows.length == 0) return res.sendStatus(404);
        if(details.rows[0].returnDate != null) return res.sendStatus(400);
        await db.query(`DELETE FROM rentals WHERE id = ${id}`);
        res.sendStatus(200);
    } catch (e){
        console.log(e);
        res.sendStatus(400);  
    }
}
