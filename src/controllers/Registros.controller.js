import http from '#configs/axios.config.js';

class RegistroController {
    constructor(registroRepository) {
        this.registroRepository = registroRepository;
        this.buscarTodosOsRegistrosController = this.buscarTodosOsRegistrosController.bind(this);
        this.buscarTodosOsRegistrosPorLinhaController = this.buscarTodosOsRegistrosPorLinhaController.bind(this);
        this.buscarRegistrosController = this.buscarRegistrosController.bind(this);        
    }

    async inserirRegistroController(pontoFinal, rota) {
        const { data } = await http.get(`/forecast/lines/load/all/forecast/${pontoFinal}/${rota}/1228`);
        try {
            await Promise.all(data.map(async (resultado) => {
                await this.registroRepository.inserirRegistroRepository(resultado.patternId, resultado.codVehicle.replace(/\D/g, ''), resultado.codVehicle, Object.values(resultado.latLng), resultado.arrivalTime);
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async buscarTodosOsRegistrosController(_, res) {
        try {
            return res.status(200).send(await this.registroRepository.buscarTodosOsRegistrosRepository());
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Erro ao buscar registros' + error });
        }
    }

    async buscarTodosOsRegistrosPorLinhaController(req, res) {
        const { codigo } = req.params.codigo;

        try {
            return res.status(200).send(await this.registroRepository.buscarTodosOsRegistrosPorLinhaRepository(codigo));
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Erro ao buscar registros' + error });
        }
    }

    async buscarRegistrosController(req, res) {
        try {
            const { data, linha, numeronibus } = req.query;
            return res.status(200).send(await this.registroRepository.buscarRegistrosRepository(data, linha, numeronibus));
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Erro ao buscar registros' + error });
        }
    }
}

export default RegistroController;