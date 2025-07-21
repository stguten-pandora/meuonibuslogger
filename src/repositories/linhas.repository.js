import pool from "#configs/pg.config.js";

async function todasAsLinhasRepository() {
    try {
        const { rows } = await pool.query(`SELECT (codigo || ' - ' || nome) as nome, codigo 
            FROM pd_controller.linhas 
            ORDER BY status DESC, nome ASC`);
        return rows;
    } catch (err) {
        console.error('Erro ao buscar todas as linhas: ', err);
        throw Error('Erro ao buscar todas as linhas: ', err);
    }
}

async function todasAsLinhasAtivasRepository() {
    try {
        const { rows } = await pool.query(`SELECT DISTINCT l.codigo, r.sentido as sentido, r.id as lid, p.id_numerico as pfinal
            FROM pd_controller.rotas r
            LEFT JOIN pd_controller.linhas l ON l.id = r.id_linha 
            LEFT JOIN pd_controller.pontos p ON p.id = r.ponto_final 
            WHERE l.status = true and p.id_numerico <> 0`
        );
        return rows;
    } catch (err) {
        console.error('Erro ao buscar todas as linhas: ', err);
        return [];
    }
}

async function trocarStatusLinhasRepository(linha) {
    if (linha.toString().length < 3) return "Linha Invalida, tente novamente";
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`UPDATE pd_controller.linhas SET status = (NOT status) WHERE codigo = $1`, [linha]);
        await client.query('COMMIT');
        return "Linha Atualizada";
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error('Erro ao atualizar linha: ', err);
    } finally {
        client.release();
    }
}

export {
    todasAsLinhasRepository,
    todasAsLinhasAtivasRepository,
    trocarStatusLinhasRepository
}