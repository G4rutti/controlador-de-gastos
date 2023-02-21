const mongoose = require("mongoose")
require('dotenv').config();
const cors = require('cors')
const bodyParser = require('body-parser')
mongoose.set("strictQuery", true);
const Financas = require("../config/finance-model.cjs");
const express = require("express");
const app = express();

// forma de ler Json - maddlewares
app.use(cors())
app.use(
  express.urlencoded({
      extended: true
  })
)
app.use(bodyParser.json())

// Configuração da porta do servidor
const PORT = process.env.PORT || 3000;

//liberando o uso do css
app.use(express.static('public'));

// Rota principal
app.get("/", async (req, res) =>{
    res.send("hello world")
})

app.get("/ler", async (req, res) => {
    const cursor = await Financas.find({})
    return res.send(cursor)
});

app.post("/criar", async(req, res) =>{
    const { id, tipo, descricao, valor } = req.body;
    const gasto = new Financas({ id: id, tipo: tipo, descricao: descricao, valor: valor });
    gasto.save(function (err) {
        if (err) return console.error('Erro ao salvar gasto:',err);
        console.log(req.body)
        res.send('Gasto salvo com sucesso');
    });
})

app.delete("/deletar/:id", async(req, res) =>{
    try {
        const id = req.params.id;
        await Financas.deleteOne({id:id});
        res.json({ message: 'Registro deletado com sucesso' });
      } catch (error) {
        console.error('Erro ao deletar registro:', error);
        res.status(500).json({ error: 'Erro ao deletar registro' });
      }
})


// app.listen(PORT)
// console.log('Conectado')
// Entregar uma porta
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.3gunjkh.mongodb.net/?retryWrites=true&w=majority`)
// mongoose.connect(`mongodb+srv://davigarutti5:BFiP1LTgvWe7GQL1@cluster0.3gunjkh.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
    app.listen(PORT)
    console.log('Conectado')
})
.catch((error) => {
    console.log(error)
})