const router = require('express').Router()
// Models
const Loan = require('../models/Loan')

// MIDDLEWARE
const verifyAuth = require('../middleware/verifyAuth')
const Customer = require('../models/Customer')

// GET | /api/v1/loan | public | get all Loan 
router.get('/loan', async (req, res) => {

    //  const user = await Loan.find({}).populate('customer')
    try {
        //  console.log( 'datos',req)
        //  const get_user = await Customer.findById(req.customer)
        //  console.log( 'get user:',get_user )
        //const loanData  = await Loan.find({cliente: get_user}).populate('loan_by')
        //    const loanData= await Loan.find().populate('customer')

        const loanData = await Loan.find()
        console.log(loanData)
        return res.status(200).json({
            data: loanData,
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
    }
})
// GET | /api/v1/LOAN/:id | public | get a single loan by id
router.get('/loan/:id', async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id)
        if (!loan) {
            res.status(400).json({ success: false, message: 'Prestamo no encontrado' })
        }

        res.status(200).json({
            data: loan,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false })
    }
})

/*
 amount: '20000',
    loanPayment: '1500',
    time: '24',
    categories: 'Consumo',
    interestRate: '18',
    status: 'example 2'


*/
// LOAN | /api/v1/add-newloan| private | add a new customer
router.post('/add-newloan', verifyAuth, async (req, res) => {

    const loanData = {
    cliente: req.body.name,
        ...req.body
    };
    try {
        // Obtén el ID del cliente seleccionado desde el frontend
        // Crea un nuevo préstamo
        const loan = await Loan.create({
            nameClient:req.body.name,
            cliente:req.body.id,
            salary: req.body.salary,
            amount: req.body.amount,
            cedula: req.body.cedula,
            interestRate: req.body.interestRate,
            job: req.body.job,
            loanPayment:req.body.loanPayment,
            motiveLoan: req.body.motiveLoan,
            time: req.body.time
        });
        // Encuentra al cliente seleccionado y agrega el ID del préstamo a su lista de préstamos
        const customer = await Customer.findByIdAndUpdate(
            req.body.id,
            { $push: { loanList: loan._id } }, // Agrega el ID del préstamo a la lista de préstamos del cliente
            { new: true } // Devuelve el cliente actualizado
        ).populate('loanList'); // Utiliza populate para cargar la lista de préstamos del cliente

        res.status(200).json({
            data: customer,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
    }

})


// PUT | /api/v1/loan/edit-loan/:id| Private | Edit a loan
router.put('/edit-loan/:id', verifyAuth, async (req, res) => {
    try {
        const loanId = req.params.id;
        const updates = req.body;
        const updatedLoan = await Loan.findByIdAndUpdate(loanId, updates, { new: true });
        if (!updatedLoan) {
            return res.status(400).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }
        res.status(200).json({
            data: updatedLoan,
            success: true
        });
    } catch (error) {
 console.log(error);
        res.status(400).json({ success: false });

    }
})

/*
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

*/
module.exports = router