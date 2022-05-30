import { Router } from "express";

import { getCustomers, postCustomers, getCustomersId, updateCustomersId } from "../controllers/customersControllers.js";

const customersRoutes = Router();

customersRoutes.post('/customers', postCustomers);
customersRoutes.get('/customers', getCustomers);
customersRoutes.get('/customers/:id', getCustomersId);
customersRoutes.put('/customers/:id', updateCustomersId);

export default customersRoutes;