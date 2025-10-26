import InicializacaoController from "#controllers/Inicializacao.controller.js";
import InicializacaoRepository from "#repositories/inicializacao.repository.js";

const inicializacaoController = new InicializacaoController(new InicializacaoRepository());

try {
  await inicializacaoController.start();
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}