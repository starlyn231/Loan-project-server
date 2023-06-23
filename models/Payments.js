const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'loan',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },


}, {


  toJSON: { virtuals: true },
  toObject: { virtuals: true }

});

module.exports = mongoose.model("payment", paymentSchema);


