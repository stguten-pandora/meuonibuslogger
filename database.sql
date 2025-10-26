CREATE SCHEMA IF NOT EXISTS pd_controller;

CREATE TABLE IF NOT EXISTS pd_controller.linhas (
	id int2 NOT NULL,
	nome text NULL,
	codigo text NULL,
	status bool DEFAULT false NOT NULL,
	CONSTRAINT linhas_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pd_controller.pontos (
	id text NOT NULL,
	nome varchar NULL,
	id_numerico int4 NULL,
	CONSTRAINT pontos_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pd_controller.registros (
	id serial4 NOT NULL,
	id_rota int2 NULL,
	id_veiculo int4 NULL,
    id_veiculo_completo text NULL,
	posicao _text NULL,
	tempo_chegada int2 NULL,
	horario timestamp DEFAULT now() NULL,
	CONSTRAINT registros_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS pd_controller.rotas (
	id int2 NOT NULL,
	sentido text NULL,
	ponto_inicial text NULL,
	ponto_final text NULL,
	id_linha int2 NULL,
	CONSTRAINT rotas_pk PRIMARY KEY (id)
);

CREATE OR REPLACE VIEW pd_controller.registros_view
AS SELECT row_number() OVER () AS id,
	r.id_veiculo_completo AS veiculo,
	rota.sentido,
	r.tempo_chegada AS tempochegada,
	r.horario
FROM pd_controller.registros r
	JOIN pd_controller.rotas rota ON rota.id = r.id_rota
	JOIN pd_controller.linhas l ON l.id = rota.id_linha
WHERE r.horario::date = CURRENT_DATE;