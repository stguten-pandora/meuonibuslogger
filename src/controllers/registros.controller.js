import http from '#configs/axios.config.js';
import * as registroRepository from '#repositories/registros.repository.js';

async function inserirRegistroController(pontoFinal, rota) {
    const { data } = await http.get(`/forecast/lines/load/all/forecast/${pontoFinal}/${rota}/1228`);
    try {
        await Promise.all(data.map(async (resultado) => {
            await registroRepository.inserirRegistroRepository(resultado.patternId, resultado.codVehicle.replace(/\D/g, ''), resultado.codVehicle, Object.values(resultado.latLng), resultado.arrivalTime);
        }));
    } catch (error) {
        console.log(error);
    }
}

async function buscarTodosOsRegistrosController(_, res) {
    try {
        return res.status(200).send(await registroRepository.buscarTodosOsRegistrosRepository());
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Erro ao buscar registros' + error });
    }
}

async function buscarTodosOsRegistrosPorLinhaController(req, res) {
    const { codigo } = req.params.codigo;

    try {
        return res.status(200).send(await registroRepository.buscarTodosOsRegistrosPorLinhaRepository(codigo));
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Erro ao buscar registros' + error });
    }
}

async function buscarRegistrosController(req, res) {
    try {
        const { data, linha, numeronibus } = req.query;
        return res.status(200).send(await registroRepository.buscarRegistrosRepository(data, linha, numeronibus));
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Erro ao buscar registros' + error });
    }

}

export { inserirRegistroController, buscarTodosOsRegistrosController, buscarTodosOsRegistrosPorLinhaController, buscarRegistrosController }