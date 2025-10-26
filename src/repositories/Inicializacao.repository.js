import pool from "#configs/pg.config.js";

class InicializacaoRepository {
    constructor() {
        this.pool = pool;
    }
    async popularDataBase(linhas, pontos) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');            
            for (const linha of linhas) {
                const nomeLinha = linha.name.split('-');
                await client.query('INSERT INTO pd_controller.linhas(id, nome, codigo) values ($1,$2,$3) ON CONFLICT DO NOTHING',
                    [linha.id, nomeLinha.length == 1 ? linha.name.substring(linha.name.search(' ')).trimStart() : nomeLinha[1].trimStart(), linha.numero]);
                await client.query('INSERT INTO pd_controller.rotas(id, id_linha, sentido, ponto_inicial, ponto_final) values ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
                    [linha.trajetos[0].id_migracao, linha.id, linha.trajetos[0].nome, linha.trajetos[0].startPoint._id, linha.trajetos[1].startPoint._id]);
                await client.query('INSERT INTO pd_controller.rotas(id, id_linha, sentido, ponto_inicial, ponto_final) values ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
                    [linha.trajetos[1].id_migracao, linha.id, linha.trajetos[1].nome, linha.trajetos[1].startPoint._id, linha.trajetos[0].startPoint._id]);
            }
            for (const ponto of pontos) {
                await client.query('INSERT INTO pd_controller.pontos(id, nome, id_numerico) values ($1,$2,$3) ON CONFLICT DO NOTHING',
                    [ponto._id, ponto.name, ponto.id]);
            }
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Erro ao popular o banco de dados: ${error.message}`);
        } finally {
            client.release();
        }
    }
}

export default InicializacaoRepository;