import os from 'os';
import path from 'path';
import fs from "node:fs";
import { execSync } from 'node:child_process';
import { sendAlerts } from '#controllers/telegram.controller.js';
import { databaseUpload } from '#controllers/gdrive.controller.js';

async function backupController() {
    try {
        const data = new Date().toLocaleString('pt-BR').replace(',', '').split(' ')[0].replace(/\//g, '-');
        const destinationFilename = `${data}.sql`;
        const destinationDir = path.resolve(process.cwd(), ".data", "backups");
        if (!fs.existsSync(destinationDir)) fs.mkdirSync(destinationDir, { recursive: true });
        const destinationPath = path.resolve(process.cwd(), ".data", "backups", destinationFilename);
        const pgDumpCommand = `pg_dump --dbname='postgresql://${process.env.PG_USER}:${process.env.PG_PASS}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}' -n pd_controller > ${destinationPath}`;
        
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