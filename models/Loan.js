const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      required: true
    },
    numberLoan: { type: String, required: true, unique: true },
    amount: { type: String, required: true },
    cuota: { type: String, required: true },
    categories: { type: Array },
   
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }

);

module.exports = mongoose.model("Loan", LoanSchema);