import app from "#src/app.js";
import backupRoutine from "#crons/backup.cron.js";
import refreshTokenRoutine from "#crons/google.cron.js";
import rotinaSalvarPosicao from "#crons/registro.cron.js";
import { sendAlerts } from "#controllers/telegram.controller.js";
import popularDataBase from "#repositories/inicializacao.repository.js";

popularDataBase();

rotinaSalvarPosicao.start();
backupRoutine.start();
refreshTokenRoutine.start();

app.listen(3000, () => {
  console.log(`Servidor iniciado em http://localhost:3000.`);
  sendAlerts("Alerta", "Servidor Iniciado.", "O servidor está totalmente inicializado.");
});