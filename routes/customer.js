const router = require('express').Router()
// Models
const Customer = require('../models/Customer')
//const User = require('../models/User')
// MIDDLEWARE
const verifyAuth = require('../middleware/verifyAuth')

// GET | /api/v1/customer | public | get all customer 
router.get('/customers', async (req, res) => {
    
    try {
        const customer = await Customer.find()
        return res.status(200).json({
            data: customer,
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
    }
})
// GET | /api/v1/customer/:id | public | get a single customer by id
router.get('/customer/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) {
            res.status(400).json({ success: false, message: 'Cliente no encontrado' })
        }

        res.status(200).json({
            data: customer,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false })
    }
})
// POST | /api/v1/add-newCustomer| private | add a new customer
router.post('/add-newCustomer', verifyAuth, async (req, res) => {

    try {
        const client = await Customer.create({
            salary: req.body.salary,
            address: req.body.address,
            province: req.body.province,
            country: req.body.country,
            sector: req.body.sector,
            name: req.body.name,
            lastName: req.body.lastName,
            cedula: req.body.cedula,
            email: req.body.email,
            job: req.body.job,
            phone:req.body.phone,
            customer_image: req.body.customer_image
        });
        res.status(200).json({
            data: client,
            success: true,
        });
    } catch (error) {
        if (error.code === 11000) {
            if ('email' in error.keyPattern) {
                // Error de clave duplicada en el campo "email"
                return res.status(400).json({ error: 'El email ya está registrado, inserte otro' });
            }
            if ('cedula' in error.keyPattern) {
                // Error de clave duplicada en el campo "cedula"
                return res.status(400).json({ error: 'La cedula ya está registrada, inserte otra' });
            }
        }

       else {
            console.log(error);
            res.status(400).json({ success: false ,  message: 'Internal Server Error'});
        }
  
        return res.status(500).json({ error: 'Internal Server Error' });
    }

})


// PUT | /api/v1/post/edit-customer/:id| Private | Edit a customer
router.put('/edit-customer/:id', verifyAuth, async (req, res) => {
    try {
        const customerId = req.params.id;
        const updates = req.body;

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updates, { new: true });

        if (!updatedCustomer) {
            return res.status(400).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            data: updatedCustomer,
            success: true
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // Error de clave duplicada en el campo de email
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        } else {
            console.log(error);
            res.status(400).json({ success: false });
        }
    }
})
// DELETE | /api/v1/post/delete-customer/:id | Private | delete a customer
router.delete('/delete-customer/:id', verifyAuth, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        else {
            // Eliminar el cliente
            await Customer.findByIdAndDelete(customer);
        }
        // Eliminar el cliente


        res.status(200).json({
            success: true,
            data: customer,
            message: 'Cliente eliminado correctamente'
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: err })
    }
})
module.exports = router