import telegramBot from "#configs/telebot.config.js";

telegramBot.on("text", () => { })

async function sendAlerts(typeAlert, message, descricao) {
  try {
    const dataAtual = new Date().toLocaleString('pt-BR').replace(',', '').trim();

    message = `📅 <b>EVENTO DO SISTEMA</b> 📅\n\n` +
      `<b>Tipo de Evento:</b> ${typeAlert} \n` +
      `<b>Mensagem:</b> ${message} \n` +
      `<b>Data e Hora:</b> ${dataAtual} \n` +
      `<b>Descrição:</b> ${descricao} \n`;

    return telegramBot.sendMessage("@meuonibus", message, { parseMode: "html", notification: false });
  } catch (error) {
    console.error("Erro ao enviar alerta:", error);
    throw new Error(`Erro ao enviar alerta: ${error.message}`);
  }
}

export { sendAlerts };