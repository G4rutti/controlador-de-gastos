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
});

app.get("/ler", async (req, res) => {
    const cursor = await Financas.find({})
    return res.send(cursor)
});
app.get("/tipoDado/:tipo", async(req, res) => {
    try {
        const tipo = req.params.tipo;
        console.log(tipo)
        const cursor = await Financas.find({tipoPasta:tipo})
        console.log(cursor)
        return res.send(cursor)
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro' });
    }
    
})
app.post("/criarPasta", async(req,res) => {
    try {
        const {tipoPasta} = req.body
        const pasta = new Financas({tipoPasta: tipoPasta});
        pasta.save(function(err){
            if (err) return console.error('Erro ao salvar pasta:',err);
            console.log(req.body)
            res.send('Pasta salva com sucesso');
        })
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        res.status(500).json({ error: 'Erro ao adicionar registro' });
    }
})
app.patch("/criarGasto/:tipoPasta", async(req, res) => {
    const novoValor = {
        idGasto: req.body.idGasto,
        tipo: req.body.tipo,
        descricao: req.body.descricao,
        valor: req.body.valor,
      };
    
      Financas.findOneAndUpdate(
        { tipoPasta: req.params.tipoPasta },
        { $push: { gastos: novoValor } },
        { new: true },
        (err, doc) => {
          if (err) {
            res.status(500).json({ erro: "Erro ao atualizar documento" });
          } else if (!doc) {
            res.status(404).json({ erro: "Documento não encontrado" });
          } else {
            res.json(doc);
          }
        }
      );
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
app.delete("/gastos/:tipo/:idGastos", async (req, res) => {
  try {
    const { tipo, idGastos } = req.params;

    // Encontrar todos os documentos de Financas com o tipo especificado
    const financasArray = await Financas.find({ tipo });
    if (financasArray.length === 0) {
      return res.status(404).json({ error: 'Tipo de financas não encontrado' });
    }

    // Encontrar o gasto correto em um dos documentos de Financas
    const financas = financasArray.find(fin => fin.gastos.some(g => g.idGasto == idGastos));
    if (!financas) {
      return res.status(404).json({ error: 'Gasto não encontrado' });
    }

    // Remover o gasto do array
    financas.gastos = financas.gastos.filter(g => g.idGasto !== idGastos);

    // Salvar as alterações no banco de dados
    await financas.save();

    res.json({ message: 'Gasto removido com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocorreu um erro ao remover o gasto');
  }
});
// app.get("/gastos/:tipo/:idGastos", async (req, res) => {
//   try {
//     const { tipo, idGastos } = req.params;
//     const financas = await Financas.findOne({ tipo , idGastos });
//     if (!financas) {
//       return res.status(404).json({ error: 'Tipo de financas não encontrado' });
//     }
//     const gastos = financas.gastos;
//     res.json(gastos);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Ocorreu um erro ao buscar os gastos');
//   }
// });

  

// app.listen(PORT)
// console.log('Conectado')
// Entregar uma porta
// const DB_USER = process.env.DB_USER
// const DB_PASSWORD = process.env.DB_PASSWORD
mongoose.connect(`mongodb+srv://davigarutti5:BFiP1LTgvWe7GQL1@cluster0.3gunjkh.mongodb.net/?retryWrites=true&w=majority`,{ useNewUrlParser: true })
.then(() => {
    app.listen(PORT)
    console.log('Conectado')
})
.catch((error) => {
    console.log(error)
})