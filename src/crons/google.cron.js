import cron from 'node-cron';
import { gDriveApi } from '#controllers/gdrive.controller.js';
import { sendAlerts } from '#controllers/telegram.controller.js';

async function refreshToken(){
    try{
        await gDriveApi();
        sendAlerts("Alerta", "Token Google", "Token do Google foi atualizado.");
    }catch(error){
        console.log(error);
        sendAlerts("Erro", "Token Google", "Erro ao atualizar o token do Google.\n" + error);
    }
}

const refreshTokenRoutine = cron.schedule("0 0 * * 0", refreshToken);

export default refreshTokenRoutine;