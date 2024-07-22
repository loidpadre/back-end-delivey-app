const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = 3000;
const app = express();
const Prod = require("./ProdSchema.js");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("Ola mundo");
});

//rota para cadastrar produto
app.post("/add", async (req, res) => {
  try {
    const { name, price, description, img } = req.body;
    const prod = {
      name,
      price,
      description,
      img,
    };
    const response = await Prod.create(prod);
    if (response) {
      return res
        .status(200)
        .json({ message: "Produto cadastrado com sucess", produto: response });
    } else {
      res.status(400).json({ message: "Erro ao cadastrar produto" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Falha ao cadastrar produto", erro: error });
  }
});

//rota para pegar todos os produtos
app.get("/home", async (req, res) => {
  try {
    const response = await Prod.find();
    if (response.length > 0) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ message: "Nenhum produto encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados", erro: error });
  }
});

//rota para pegar um produto
app.get("/detail/:id", async (req, res) => {
  const prodId = req.params.id;
  try {
    const prod = await Prod.findById(prodId);
    if (prod) {
      return res.status(200).json(prod);
    } else {
      return res.status(400).json({ message: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produto", erro: error });
  }
});

// rota para deletar os produtos

app.delete("/delete/:id", async (req, res) => {
  const prodId = req.params.id;
  try {
    const prod = await Prod.findById(prodId);
    if (!prod) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    await Prod.findByIdAndDelete(prod);
    return res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar produto", erro: error });
  }
});

// rota para editar produto

app.put("/edite/:id", async (req, res) => {
  const idProd = req.params.id;
  const { name, price, description, img } = req.body;
  const newPord = {
    name,
    price,
    description,
    img,
  };
  try {
    const prod = await Prod.findById(idProd);
    if (!prod) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // actualizando o produto no banco de dados
    const updateProd = await Prod.findByIdAndUpdate(prod, newPord, {
      new: true,
    });
    if (!updateProd) {
      return res.status(400).json({ message: "Erro ao actulizar produto" });
    }
    res
      .status(200)
      .json({ message: "Produto actulizado com sucesso", data: updateProd });
  } catch (error) {
    res.status(500).json({ message: "Erro", erro: error });
  }
});

// fazendo

mongoose
  .connect(
    "mongodb+srv://loidpadre:NOTVyBIEjlrdqfTm@deliverapp.zjjbryc.mongodb.net/?retryWrites=true&w=majority&appName=deliverapp",
  )
  .then(() => {
    app.listen(port, () => {
      console.log("Servidor e Db rodando com sucesso!");
    });
  })
  .catch((error) => {
    console.log("erro ao se conectrar a BD", error);
  });
