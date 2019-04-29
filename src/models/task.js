const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: true
};

const schema = new mongoose.Schema({
  desc: {
    type: String,
    trim: true,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
 }
}, schemaOptions);

module.exports = mongoose.model('Task', schema);
