const express = require("express");
const { request, response } = require("express");
const server = express();

server.use(express.json());
server.use((request, response, next) => {
  console.log("Controle de Estoque da Empresa ABC");
  return next();
});

const produto = [
  {
    id: "22",
    nome: "Cerveja",
    quantidade: 500,
    valorunitario: 5,
    precototal: 0,
  },
  {
    id: "26",
    nome: "Danone",
    quantidade: 120,
    valorunitario: 4,
    precototal: 0,
  },
];
function calculo(prod) {
  for (let i = 0; i < prod.length; i++) {
    prod[i].precototal = prod[i].quantidade * prod[i].valorunitario;
    prod[i].precovenda = prod[i].valorunitario + prod[i].valorunitario * 0.2;
    prod[i].lucro = prod[i].precovenda - prod[i].valorunitario;
    if (prod[i].quantidade < 50) {
      prod[i].situaçao = "A situação é estavel";
    } else if (prod[i].quantidade >= 50 && prod[i].quantidade < 100) {
      prod[i].situaçao = "A situaçao é boa";
    } else if (prod[i].quantidade >= 100) {
      prod[i].situaçao = "A situação é excelente";
    }
  }
}
function TestarId(request, response, next) {
  const { id } = request.params;
  const guarda = produto.find((obj) => {
    return obj.id === id;
  });
  if (guarda === undefined) {
    return response.status(400).json({
      Erro: "Nao existe produto com esse id",
    });
  }
  return next();
}
function retornar(request, response, next) {
  const { id, nome, quantidade, valorunitario, complemento } = request.body;
  if (
    id === "" ||
    nome === "" ||
    quantidade === "" ||
    valorunitario === "" ||
    complemento === undefined
  ) {
    return response
      .status(400)
      .json({
        erro:
          "O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição.",
      });
  }
  return next();
}

calculo(produto);

server.get("/produtos", (request, response) => {
  return response.json(produto);
});
server.get("/produtos/:id", TestarId, (request, response) => {
  const { id } = request.params;
  const filtrar = produto.filter((objeto) => {
    return objeto.id === id;
  });
  return response.json(filtrar);
});
server.post("/produtos", retornar, (request, response) => {
  produto.push(request.body);
  calculo(produto);
  return response.json(produto[produto.length - 1]);
});

server.put("/produtos", retornar, (request, response) => {
  const id = request.body.id;
  let index = 0;
  let filtrar = produto.filter((produto, index) => {
    if (produto.id === id) {
      indice = index;
      return produto.id === id;
    }
  });
  if (filtrar.length === 0) {
    return response
      .status(400)
      .json({ mensagem: "Nao existe produto com este id" });
  }
  produto[indice] = request.body;
  return response.json(produto);
});

server.delete("/produtos", (request, response) => {
  const id = request.body.id;
  const filtrar = produto.find((prod, index) => {
    if (prod.id == id) {
      console.log(produto);
      produto.splice(index, 1);
      return prod.id == id;
    }
  });
  if (!filtrar) {
    return response
      .status(400)
      .json({ mensagem: "Nao existe produto com esse id" });
  }
  return response.json(filtrar);
});

server.post("/produtos/:id/:complemento", TestarId, (request, response) => {
  const comple = request.body.complemento;
  const id = request.params.id;
  for (let i = 0; i < produto.length; i++) {
    if (produto[i].id == Number(id)) {
      produto[i].complemento = comple;
    }
  }
  return response.json(produto);
});
server.listen(3333, () => {
  console.log("Servidor Online");
});
