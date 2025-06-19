import http from "#configs/axios.config.js";
import pool from "#configs/pg.config.js";

async function popularDataBase() {
    try {
        await pool.query('BEGIN');
        const linhas = await http.get("/forecast/lines/load/allLines/1228");
        for (const linha of linhas.data) {
            const nomeLinha = linha.name.split('-');
            await pool.query('INSERT INTO pd_controller.linhas(id, nome, codigo) values ($1,$2,$3) ON CONFLICT DO NOTHING',
                [linha.id, nomeLinha.length == 1 ? linha.name.substring(linha.name.search(' ')).trimStart() : nomeLinha[1].trimStart(), linha.numero]);
            await pool.query('INSERT INTO pd_controller.rotas(id, id_linha, sentido, ponto_inicial, ponto_final) values ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
                [linha.trajetos[0].id_migracao, linha.id, linha.trajetos[0].nome, linha.trajetos[0].startPoint._id, linha.trajetos[1].startPoint._id]);
            await pool.query('INSERT INTO pd_controller.rotas(id, id_linha, sentido, ponto_inicial, ponto_final) values ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
                [linha.trajetos[1].id_migracao, linha.id, linha.trajetos[1].nome, linha.trajetos[1].startPoint._id, linha.trajetos[0].startPoint._id]);
        }
        const pontos = await http.get("/forecast/lines/load/allPoints/1228");
        for (const ponto of pontos.data) {
            await pool.query('INSERT INTO pd_controller.pontos(id, nome, id_numerico) values ($1,$2,$3) ON CONFLICT DO NOTHING',
                [ponto._id, ponto.name, ponto.id]);
        }
        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }
}

export default popularDataBase;