import { Router } from "express";
import * as registrosController from "#controllers/registros.controller.js";

const registrosRouter = Router();

registrosRouter.get("/buscar", registrosController.buscarRegistrosController);
registrosRouter.get("/todos", registrosController.buscarTodosOsRegistrosController);
registrosRouter.get("/todos/:codigo", registrosController.buscarTodosOsRegistrosPorLinhaController);

export default registrosRouter;