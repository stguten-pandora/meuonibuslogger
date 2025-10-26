import { Router } from "express";
import LinhasController from "#controllers/linhas.controller.js";
import LinhasRepository from "#repositories/linhas.repository.js";

const linhasRouter = Router();
const linhasService = new LinhasController(new LinhasRepository());

linhasRouter.get("/todas-as-linhas", linhasService.todasAsLinhasController);
linhasRouter.get("/todas-as-linhas-ativas", linhasService.todasAsLinhasAtivasController);
linhasRouter.get("/atualizar", linhasService.trocarStatusLinhasController);

export default linhasRouter;