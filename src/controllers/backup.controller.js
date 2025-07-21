import os from 'os';
import path from 'path';
import { execSync } from 'node:child_process';
import { sendAlerts } from '#controllers/telegram.controller.js';
import { databaseUpload } from '#controllers/gdrive.controller.js';

async function backupController() {
    try {
        const data = new Date().toLocaleString('pt-BR').replace(',', '').trim().split(' ')[0].replace(/\//g, '-');
        const destinationFilename = `${data}.sql`;
        const destinationPath = path.resolve(process.cwd(), ".data", "backups", destinationFilename);
        const pgDumpCommand = `pg_dump -U ${process.env.PG_USER} -d ${process.env.PG_DB} -n pd_controller > ${destinationPath}`;

        switch (os.platform()) {
            case 'linux':
            case 'win32':
                execSync(pgDumpCommand);
                break;
            default:
                throw new Error("Sistema Operacional não suportado.");
        }

        console.log(`Realizando Backup em segundo plano...\nBackup iniciado em ${new Date().toLocaleString('pt-BR').replace(',', '')}`);
        const backupId = await databaseUpload(destinationFilename, destinationPath);
        sendAlerts("Aviso", "Backup Concluido", `Backup Realizado com sucesso. Link para o arquivo: https://drive.google.com/file/d/${backupId}`);
    } catch (error) {
        console.log("Erro ao realizar o backup: ", error);
        sendAlerts("Erro", "Erro ao realizar o backup", `Erro ao realizar o backup: ${error.message}`);
        throw new Error(`Erro ao realizar o backup: ${error.message}`);
    }
}

export default backupController;