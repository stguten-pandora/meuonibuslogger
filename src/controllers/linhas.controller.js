import { sendAlerts } from '#controllers/telegram.controller.js';
import * as linhasRepository from "#repositories/linhas.repository.js";

async function todasAsLinhasController(_, res) {
    try {
        return res.status(200).send(await linhasRepository.todasAsLinhasRepository());
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao buscar todas as linhas." });
    }
}

async function todasAsLinhasAtivasController(_, res) {
    try {
        return res.status(200).send(await linhasRepository.todasAsLinhasAtivasRepository());
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao buscar linhas ativas." });
    }
}

async function trocarStatusLinhasController(req, res) {
    try {
        const { status, linha } = req.query;
        sendAlerts("Alerta", `Rota ${linha} teve o status alterado.`, `A linha ${linha} teve o status alterada para ${status == 1 ? "Ativado" : "Desativado"}`);
        return res.status(200).send(await linhasRepository.trocarStatusLinhasRepository(linha));
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro ao trocar status da linha." });
    }
}

export { todasAsLinhasController, todasAsLinhasAtivasController, trocarStatusLinhasController };