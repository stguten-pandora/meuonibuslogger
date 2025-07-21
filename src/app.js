import path from "path";
import express from "express";
import app from "#configs/express.config.js";
import linhasRouter from "#routes/linhas.route.js";
import backupRouter from "#routes/backup.route.js";
import responseBuilder from "#builders/builders.js";
import registrosRouter from "#routes/registros.route.js";

const publicDir = path.join(process.cwd(), "public");

app.use("/", express.static(publicDir));
app.use("/registros", registrosRouter);
app.use("/linhas", linhasRouter);
app.use("/backup", backupRouter);

app.get(/(.*)/, (_, res) => {
  res.status(404).send(responseBuilder(404, "Endpoint não encontrado."));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(responseBuilder(500, "Erro interno."));
});

export default app;
