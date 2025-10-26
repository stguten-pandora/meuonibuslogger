import pool from "#configs/pg.config.js";

class RegistrosRepository {
    constructor() {
        this.pool = pool;
    }
    
    async inserirRegistroRepository(idRota, idVeiculo, idVeiculoCompleto, posicao, tempoChegada) {
        const client = await pool.connect();
        try {
            await client.query(
                `INSERT INTO pd_controller.registros (id_rota, id_veiculo, id_veiculo_completo, posicao, tempo_chegada) VALUES ($1, $2, $3, $4, $5)`,
                [idRota, idVeiculo, idVeiculoCompleto, posicao, tempoChegada]
            );
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error('Erro ao salvar registro: ', err);
        } finally {
            client.release();
        }
    }

    async buscarTodosOsRegistrosRepository() {
        try {
            const result = await pool.query(`SELECT * FROM pd_controller.registros_view`);
            return result.rows;
        } catch (err) {
            console.error('Erro ao consultar registros: ', err);
            throw Error('Erro ao consultar registros: ', err);
        }
    }

    async buscarTodosOsRegistrosPorLinhaRepository(linha) {
        try {
            const { rows } = await pool.query(`
                SELECT row_number() over() as id, r.id_veiculo_completo as veiculo, rota.sentido, r.tempo_chegada as tempochegada, r.posicao, to_char(r.horario, 'DD/MM/YYYY HH:MI:SS') as horario
                FROM pd_controller.registros r 
                JOIN pd_controller.rotas rota ON rota.id = r.id_rota 
                JOIN pd_controller.linhas l ON l.id = rota.id_linha
                WHERE l.codigo = $1
                ORDER BY r.horario ASC`, [linha]
            );
            return rows;
        } catch (err) {
            console.error('Erro ao consultar registros: ', err);
            throw Error('Erro ao consultar registros: ', err);
        }
    }

    async buscarRegistrosRepository(data, linha, numeroOnibus) {        
        try {
            const conditions = [];
            const values = [];
            let paramIndex = 1;

            if (data !== '') {
                conditions.push(`r.horario::date = $${paramIndex++}`);
                values.push(data);
            }
            if (linha !== '') {
                conditions.push(`l.codigo = $${paramIndex++}`);
                values.push(linha);
            }
            if (numeroOnibus != 0) {
                conditions.push(`r.id_veiculo = $${paramIndex++}`);
                values.push(numeroOnibus);
            }

            const whereClause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

            const query = `
                SELECT row_number() over() as id, r.horario, r.id_veiculo_completo as veiculo, rota.sentido, r.tempo_chegada as tempochegada, r.posicao
                FROM pd_controller.registros r 
                JOIN pd_controller.rotas rota ON rota.id = r.id_rota 
                JOIN pd_controller.linhas l ON l.id = rota.id_linha 
                ${whereClause}
                ORDER BY r.horario ASC
            `;

            const { rows } = await pool.query(query, values);
            return rows;
        } catch (err) {
            console.error('Erro ao consultar registros: ', err);
            throw Error('Erro ao consultar registros: ', err);
        }
    }
}

export default RegistrosRepository;