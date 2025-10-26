import { Router } from "express";
import registrosController from "#controllers/registros.controller.js";
import RegistrosRepository from "#repositories/registros.repository.js";

const registrosRouter = Router();
const registrosService = new registrosController(new RegistrosRepository());

registrosRouter.get("/buscar", registrosService.buscarRegistrosController);
registrosRouter.get("/todos", registrosService.buscarTodosOsRegistrosController);
registrosRouter.get("/todos/:codigo", registrosService.buscarTodosOsRegistrosPorLinhaController);

export default registrosRouter;