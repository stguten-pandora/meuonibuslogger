import cron from 'node-cron';
import RegistrosRepository from '#repositories/Registros.repository.js';
import LinhasRepository from '#repositories/Linhas.repository.js';
import RegistroController from '#controllers/Registros.controller.js';

const linhaService = new LinhasRepository();
const registroService = new RegistroController(new RegistrosRepository());

async function salvarDadosOnibus() {
    try {
        const linhas = await linhaService.todasAsLinhasAtivasRepository();
        for (const linha of linhas) {
            await registroService.inserirRegistroController(linha.pfinal, linha.lid);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao salvar dados do ônibus.');
    }
}

const registrosCron = cron.schedule('* 0,4-23 * * *', salvarDadosOnibus);

export default registrosCron;