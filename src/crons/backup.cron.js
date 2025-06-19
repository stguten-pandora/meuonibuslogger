import cron from 'node-cron';
import backupController from '#controllers/backup.controller.js';
import { sendAlerts } from '#controllers/telegram.controller.js';

async function backup() {
    try {
        await backupController();
        sendAlerts("Alerta", "Backup", "Backup realizado com sucesso.");
    } catch (e) {
        console.log(e);
        sendAlerts("Erro", "Backup", "Erro ao realizar o backup.\n" + e);
    }
}

const backupRoutine = cron.schedule("0 4 1 1 *", backup);

export default backupRoutine;