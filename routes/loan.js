const router = require('express').Router()
// Models
const Loan = require('../models/Loan')
const moment = require('moment');


// MIDDLEWARE
const verifyAuth = require('../middleware/verifyAuth')
const Customer = require('../models/Customer')

// GET | /api/v1/loan | public | get all Loan 
router.get('/loan', async (req, res) => {

    //  const user = await Loan.find({}).populate('customer')
    try {


        const loanData = await Loan.find()


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
        /*  const loanDate = new Date(); // Obtén la fecha actual
          const dueDate = new Date(loanDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Añade 30 días a la fecha actual
          
          const day = dueDate.getDate(); // Obtén el día del mes
          const month = dueDate.getMonth() + 1; // Obtén el mes (se suma 1 porque los meses en JavaScript son basados en 0)
          
          console.log('Día:', dueDate);
          console.log('Mes:', month); */

        const loan = await Loan.create({
            nameClient: req.body.name,
            cliente: req.body.id,
            salary: req.body.salary,
            amount: req.body.amount,
            cedula: req.body.cedula,
            interestRate: req.body.interestRate,
            job: req.body.job,
            loanPayment: req.body.loanPayment,
            loanPaymentMonth: req.body.loanPayment,
            motiveLoan: req.body.motiveLoan,
            time: req.body.time,
            totalPayment: req.body.totalPayment,
            totalPaymentOriginal: req.body.totalPayment,
            created_at: new Date(),
            dueDate: calculateDueDate(new Date(), req.body.time), // Calcula la fecha de vencimiento inicial
            paymentLoanDate: calculatePaymentDate(new Date(), req.body.time), // Calcula la fecha de pago inicial
        });


        function calculateDueDate(startDate, time) {

            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + (time * 30)); // Agrega el tiempo de préstamo en días (cada mes se considera de 30 días)
            console.log('calculateDueDate:', dueDate)
            return dueDate;
        }

        function calculatePaymentDate(startDate, time) {
            const paymentLoanDate = new Date(startDate);
            const dayOfMonth = paymentLoanDate.getDate(); // Obtiene el día del mes inicial del préstamo
            const paymentDayOfMonth = dayOfMonth <= 22 ? dayOfMonth : 30; // Establece el día de pago como el día del mes inicial o el 28, lo que sea menor
            const paymentDates = []; // Array para almacenar las fechas de pago

            for (let i = 0; i < time; i++) {
                paymentLoanDate.setMonth(paymentLoanDate.getMonth() + 1); // Incrementa el mes
                paymentLoanDate.setDate(paymentDayOfMonth); // Establece el día de pago

                paymentDates.push(new Date(paymentLoanDate)); // Agrega la fecha de pago al array
            }
            console.log('paymentLoanDate', paymentDates)

            return paymentDates;


        }
        // Igualar loanPaymentMonth y loanPayment
        //loan.loanPaymentMonth = loan.loanPayment;
        // Encuentra al cliente seleccionado y agrega el ID del préstamo a su lista de préstamos
        const customer = await Customer.findByIdAndUpdate(
            req.body.id,
            { $push: { loanList: loan._id } }, // Agrega el ID del préstamo a la lista de préstamos del cliente
            { new: true } // Devuelve el cliente actualizado
        ).populate('loanList'); // Utiliza populate para cargar la lista de préstamos del cliente

        res.status(200).json({
            loan,
            data: customer,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error });
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