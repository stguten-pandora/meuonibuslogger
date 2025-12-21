import cron from 'node-cron';
import backupController from '#controllers/backup.controller.js';
import Telegram from '#controllers/Telegram.controller.js';

async function backup() {
    try {
        await backupController();
        Telegram.sendAlert("Alerta", "Backup", "Backup realizado com sucesso.");
    } catch (error) {
        console.log(error);
        Telegram.sendAlert("Erro", "Backup", "Erro ao realizar o backup.\n" + error);
    }
}

const backupCron = cron.schedule("0 4 1 1 *", backup);

export default backupCron;