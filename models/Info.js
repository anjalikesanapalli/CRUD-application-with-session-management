
const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  notes: { type: String },
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Info = mongoose.model('Info', infoSchema);
module.exports = Info;
