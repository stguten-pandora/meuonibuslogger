import cron from 'node-cron';
import { todasAsLinhasAtivasRepository } from '#repositories/linhas.repository.js';
import { inserirRegistroController } from '#controllers/registros.controller.js';

async function salvarDadosOnibus() {
    try {
        const linhas = await todasAsLinhasAtivasRepository();
        for (const linha of linhas) {
            await inserirRegistroController(linha.pfinal, linha.lid);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao salvar dados do ônibus.');
    }
}

const rotinaSalvarPosicao = cron.schedule('* 0,4-23 * * *', salvarDadosOnibus);

export default rotinaSalvarPosicao;