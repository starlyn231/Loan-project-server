const router = require('express').Router()
// Models
const Loan = require('../models/Loan')
const moment = require('moment');
// MIDDLEWARE
const verifyAuth = require('../middleware/verifyAuth')
const Customer = require('../models/Customer')
const Payments = require('../models/Payments')

// GET | /api/v1/payments | public | get all payments 
router.get('/payments', async (req, res) => {


    try {

        const paymentsData = await Payments.find()
        console.log(paymentsData)
        return res.status(200).json({
            data: paymentsData,
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
    }
})
// GET | /api/v1/LOAN/:id | public | get a single loan by id
router.get('/payment/:id', async (req, res) => {
    try {
        const payments = await Payments.findById(req.params.id)
        if (!payments) {
            res.status(400).json({ success: false, message: 'Pago no encontrado' })
        }

        res.status(200).json({
            data: payments,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false })
    }
})


// LOAN | /api/v1/add-newloan| private | add a new customer
router.post('/loan/:id/pay', verifyAuth, async (req, res) => {


    try {
        console.log('req.params. ' ,req.params.id)
        console.log(' body payment',req.body.payment)
        const loanId = req.params.id;
        const paymentAmount = req.body.payment;
        // Aquí debes implementar la lógica para procesar el pago y actualizar el estado del préstamo
        // Puedes utilizar una pasarela de pago o alguna otra solución de tu elección para realizar el procesamiento del pago

        // Get Loan
        const loan = await Loan.findById(loanId);

        // Agrega la información del pago al array de pagos del préstamo
        loan.payments.push({
            amount: paymentAmount,
            paymentDate: new Date()
        });

        if (!loan) {
            return res.status(400).json({ success: false, message: 'Préstamo no encontrado' });
        }

        // Verifica si el préstamo ya está pagado o en mora
        if (loan.status === 'Pagado') {
            return res.status(400).json({ success: false, message: 'El préstamo ya ha sido pagado' });
        } else if (loan.status === 'Mora') {
            return res.status(400).json({ success: false, message: 'El préstamo se encuentra en mora' });
        }
        // Calcula el monto pendiente
        const remainingAmount = loan.totalPayment - paymentAmount;
        if (remainingAmount === 0) {
            // Si el monto pendiente es cero, se marca el préstamo como pagado
            loan.status = 'Pagado';
        } else if (remainingAmount > 0) {
            // Si el monto pendiente es mayor a cero, se actualiza el monto y se verifica si está en mora
            loan.totalPayment = remainingAmount;
            const dueDate = loan.dueDate; // Aquí debes tener el campo de fecha de vencimiento en tu modelo de préstamo

            if (dueDate < new Date()) {
                // Si la fecha de vencimiento ya ha pasado, se marca el préstamo como moroso
                const daysLate = Math.floor((new Date() - dueDate) / (1000 * 60 * 60 * 24)); // Calcula los días de atraso
                console.log(daysLate)
                if (daysLate > 10) {
                    // Si los días de atraso son mayores a 10, se agrega mora
                    const moraAmount = loan.amount * 0.05; // Ejemplo: se agrega un 5% de mora al monto pendiente
                    loan.totalPayment += moraAmount;
                    loan.status = 'Mora';
                }
            }
        }


        // Guarda los cambios en el préstamo
        const updatedLoan = await loan.save();
        // Guarda el pago en la base de datos
        // Crea un nuevo documento de pago
        const payment = new Payments({
            loan: loanId,
            amount: paymentAmount
        });
        const savedPayment = await payment.save();
        res.status(200).json({ success: true, message: 'Pago procesado exitosamente', loan: updatedLoan });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: 'Error al procesar el pago' });
    }

})



module.exports = router