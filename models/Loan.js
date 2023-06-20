const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema(
  {
   
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      required: true
  },
  nameClient: { type: String},
  salary: { type: Number,  },
  cedula:  { type: String, required: true},
 //lastName: { type: String, required: true, },
 // name: { type: String, required: true},
  job: { type: String, required: true},
    amount: { type: Number, required: true },
    loanPayment: { type: Number, required: true },
    time: { type: Number, required: true },
    categories: { type: Array },
    interestRate: { type: Number, required: true },
    motiveLoan:{ type:String},
   // typeLoan:{type: String, required: true},
    status: { type: String, default: "pending" },

    created_at: {
      type: Date,
      default: Date.now
    },
   
  }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
 
);
/*
LoanSchema.virtual('loan_by', {
  ref: 'customer',
  localField: 'cliente',
  foreignField: '_id',
  justOne: true
})
*/

module.exports = mongoose.model("loan", LoanSchema);
