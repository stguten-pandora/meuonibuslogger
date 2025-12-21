import cron from 'node-cron';
import { gDriveApi } from '#controllers/gdrive.controller.js';
import Telegram from '#controllers/Telegram.controller.js';

async function refreshToken(){
    try{
        await gDriveApi();
        Telegram.sendAlert("Alerta", "Token Google", "Token do Google foi atualizado.");
    }catch(error){
        console.log(error);
        Telegram.sendAlert("Erro", "Token Google", "Erro ao atualizar o token do Google.\n" + error);
    }
}

const refreshTokenCron = cron.schedule("0 0 * * 0", refreshToken);

export default refreshTokenCron;