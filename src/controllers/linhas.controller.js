import { sendAlerts } from '#controllers/telegram.controller.js';

class LinhasController {
    constructor(linhasRepository) {
        this.linhasRepository = linhasRepository;
        this.todasAsLinhasController = this.todasAsLinhasController.bind(this);
        this.todasAsLinhasAtivasController = this.todasAsLinhasAtivasController.bind(this);
        this.trocarStatusLinhasController = this.trocarStatusLinhasController.bind(this);
    }

    async todasAsLinhasController(_, res) {
        try {
            return res.status(200).send(await this.linhasRepository.todasAsLinhasRepository());
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao buscar todas as linhas." });
        }
    }

    async todasAsLinhasAtivasController(_, res) {
        try {
            return res.status(200).send(await this.linhasRepository.todasAsLinhasAtivasRepository());
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao buscar linhas ativas." });
        }
    }

    async trocarStatusLinhasController(req, res) {
        try {
            const { status, linha } = req.query;
            if (linha.toString().length < 3) return res.status(400).send({ message: "Linha Invalida, tente novamente" });
            res.status(200).send(await this.linhasRepository.trocarStatusLinhasRepository(linha));
            return sendAlerts("Alerta", `Rota ${linha} teve o status alterado.`, `A linha ${linha} teve o status alterada para ${status == 1 ? "Ativado" : "Desativado"}`);
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao trocar status da linha." });
        }
    }
}

export default LinhasController;