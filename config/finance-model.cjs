const mongoose = require("mongoose");
const financeSchema = require("./finance-schema.cjs");

const Financas = mongoose.model("Financas", financeSchema);

module.exports = Financas;