const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
  id: Number,
  tipo: Boolean,
  descricao: String,
  valor: Number,
  data: { type: Date, default: Date.now },
});

module.exports = financeSchema;