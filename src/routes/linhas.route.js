import { Router } from "express";
import * as linhasController from "#controllers/linhas.controller.js";

const linhasRouter = Router();

linhasRouter.get("/todas-as-linhas", linhasController.todasAsLinhasController);
linhasRouter.get("/todas-as-linhas-ativas", linhasController.todasAsLinhasAtivasController);
linhasRouter.get("/atualizar", linhasController.trocarStatusLinhasController);

export default linhasRouter;