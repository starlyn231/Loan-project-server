const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  UserId: {
    type: String,
    unique: true,
    required: true,
    immutable: true,
  },
  customer_image: {
    type: String
  },
  age: {
    type: Number,
    min: 18,
    max:65,
  },
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  job: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },

  province: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  sector: {
    type: String,

  },
  loanList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'loan'
    }
  ],
  // Otros campos del cliente
  created_at: {
    type: Date,
    default: Date.now
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });
/*
CustomerSchema.pre('save', async function (next) {
  let date_info = new Date
  let date_into = date_info.getDate() + '/' + (date_info.getMonth()+1) + '/' +  date_info.getFullYear()
  this.created_at = await date_into
})

*/
/*
CustomerSchema.virtual('loans', {
  ref: 'loan',
  localField: 'cliente',
  foreignField: '_id',
 justOne: false
})
*/
module.exports = mongoose.model('customer', CustomerSchema);