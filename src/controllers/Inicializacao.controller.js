import app from "#src/app.js";
import http from "#configs/axios.config.js";
import backupCron from "#src/crons/backup.cron.js";
import { sendAlerts } from "./telegram.controller.js";
import registrosCron from "#src/crons/registro.cron.js";
import refreshTokenCron from "#src/crons/google.cron.js";

class InicializacaoController {
    constructor(inicializacaoRepository) {
        this.inicializacaoRepository = inicializacaoRepository;
    }

    async popularDataBase() {
        try {
            const linhas = await http.get("/forecast/lines/load/allLines/1228");
            const pontos = await http.get("/forecast/lines/load/allPoints/1228");
            await this.inicializacaoRepository.popularDataBase(linhas.data, pontos.data);
        } catch (error) {
            console.error("Erro ao buscar dados para popular o banco de dados:", error);
            throw error;
        }
    }

    async inicializaCrons() {
        try {
            backupCron.start();
            registrosCron.start();
            refreshTokenCron.start();
        } catch (error) {
            console.error("Erro ao inicializar os cron jobs:", error);
        }
    }

    async start() {
        await this.popularDataBase();
        await this.inicializaCrons();
        app.listen(process.env.PORT || 3000, (error) => {
            if (error) throw error;
            console.log(`Servidor iniciado em http://localhost:${process.env.PORT || 3000}`);
            sendAlerts("Alerta", "Servidor Iniciado.", "O servidor está totalmente inicializado.");
        });
    }
}

export default InicializacaoController;