import pool from "#configs/pg.config.js";

async function inserirRegistroRepository(idRota, idVeiculo, idVeiculoCompleto, posicao, tempoChegada) {
    try {
        await pool.query(
            `INSERT INTO pd_controller.registros (id_rota, id_veiculo, id_veiculo_completo, posicao, tempo_chegada) VALUES ($1, $2, $3, $4, $5)`,
            [idRota, idVeiculo, idVeiculoCompleto, posicao, tempoChegada]
        );
    } catch (err) {
        console.error('Erro ao salvar registro: ', err);
        throw Error('Erro ao salvar registro: ', err);
    }
}

async function buscarTodosOsRegistrosRepository() {
    try {
        const { rows } = await pool.query(
            `SELECT row_number() over() as id, r.id_veiculo_completo as veiculo, rota.sentido, r.tempo_chegada as tempochegada, r.posicao, to_char(r.horario, 'DD/MM/YYYY HH:MI:SS') as horario
            FROM pd_controller.registros r 
            JOIN pd_controller.rotas rota ON rota.id = r.id_rota 
            JOIN pd_controller.linhas l ON l.id = rota.id_linha`
        );
        return rows;
    } catch (err) {
        console.error('Erro ao consultar registros: ', err);
        throw Error('Erro ao consultar registros: ', err);
    }
}

async function buscarTodosOsRegistrosPorLinhaRepository(linha) {
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

async function buscarRegistrosRepository(data, linha, numeroOnibus) {
    try {
        const { rows } = await pool.query(`SELECT row_number() over() as id, r.horario, r.id_veiculo_completo as veiculo, rota.sentido, r.tempo_chegada as tempochegada, r.posicao
            FROM pd_controller.registros r 
            JOIN pd_controller.rotas rota ON rota.id = r.id_rota 
            JOIN pd_controller.linhas l ON l.id = rota.id_linha 
            WHERE
                1 = 1
                ${data !== '' ? ` and r.horario between '${data}' and date '${data}' + 1` : ''}
                ${linha !== '' ? ` and l.codigo = '${linha}'` : ''}
                ${numeroOnibus != 0 ? ` and r.id_veiculo = ${numeroOnibus}` : ''}
            ORDER BY r.horario ASC`);
        return rows;
    } catch (err) {
        console.error('Erro ao consultar registros: ', err);
        throw Error('Erro ao consultar registros: ', err);
    }
}

async function limparDatabase() {
    try {
        await pool.query('TRUNCATE FROM registros');
    } catch (err) {
        console.error('Erro ao limpar o banco de dados: ', err);
        throw Error('Erro ao limpar o banco de dados: ', err);
    }
}

export { inserirRegistroRepository, buscarTodosOsRegistrosRepository, buscarTodosOsRegistrosPorLinhaRepository, buscarRegistrosRepository, limparDatabase }