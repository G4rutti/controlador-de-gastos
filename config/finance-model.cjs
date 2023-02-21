const mongoose = require("mongoose");
const financeSchema = require("./finance-schema");

const Financas = mongoose.model("Financas", financeSchema);

module.exports = Financas;