import db from "../db.js";
import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10,11}$')).required(),
    cpf: Joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
    birthday: Joi.date().required()
})

////////////customers/////////////
export async function getCustomers (req, res) {
    const cpf = req.query.cpf;
    try {
        let nameCpf = null;
        if (cpf){
            const listCpf = await db.query(`SELECT cpf FROM customers`);
            nameCpf = listCpf.rows.find(el => {
                return el.cpf.substr(0, cpf.length) == cpf      
            })
        }
        const customers = await db.query(`SELECT * FROM customers
            ${(nameCpf? `WHERE customers.cpf = '${nameCpf.cpf}'` : '')}`);
        res.status(200).send(customers.rows);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}

export async function getCustomersId (req, res) {
    const id = req.params.id;
    try {
        const customers = await db.query(`SELECT * FROM customers WHERE id = ${id}`);
        if (customers.rows.length == 0) return res.sendStatus(404);
        res.status(200).send(customers.rows[0]);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}

export async function postCustomers (req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const { error } = schema.validate({ name, phone, cpf, birthday });
        if (error) return res.sendStatus(400);
        const customersCpf = await db.query(`SELECT cpf FROM customers`);
        if (customersCpf.rows.some(el => el.cpf == cpf)) 
            return res.sendStatus(409);
        await db.query(`INSERT INTO customers 
            (name, phone, cpf, birthday) 
            VALUES ('${name}', '${phone}', '${cpf}', TO_DATE('${birthday}', 'YYYY/MM/DD'))`);
        res.sendStatus(201);      
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}

export async function updateCustomersId (req, res) {
    const id = req.params.id;
    const { name, phone, cpf, birthday } = req.body;
    try {
        const { error } = schema.validate({ name, phone, cpf, birthday });
        if (error) return res.sendStatus(400);
        const customersCpf = await db.query(`SELECT cpf FROM customers`);
        if (customersCpf.rows.some(el => el.cpf == cpf)) 
            return res.sendStatus(409);
        await db.query(`UPDATE customers SET
                name = '${name}',
                phone = '${phone}',
                cpf = '${cpf}',
                birthday = '${birthday}'
            WHERE id = ${id}`);
        res.sendStatus(200);
    } catch (e){
        console.log(e);
        res.sendStatus(400);
    }
}