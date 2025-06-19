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

CREATE TABLE IF NOT EXISTS pd_controller.veiculos (
	numero int4 NOT NULL,
	empresa text NULL,
	carroceria text NULL,
	chassi text NULL,
	link_foto text NULL,
	ac bool DEFAULT false NOT NULL,
	cobrador bool DEFAULT false NOT NULL,
	acessibilidade bool DEFAULT false NOT NULL,
	CONSTRAINT veiculos_pk PRIMARY KEY (numero)
);