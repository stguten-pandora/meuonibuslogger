import axios from "axios";

async function sendAlerts(typeAlert, message, descricao) {
  try {
    const dataAtual = new Date().toLocaleString('pt-BR').replace(',', '').trim();

    message = `📅 <b>EVENTO DO SISTEMA</b> 📅\n\n` +
      `<b>Tipo de Evento:</b> ${typeAlert} \n` +
      `<b>Mensagem:</b> ${message} \n` +
      `<b>Data e Hora:</b> ${dataAtual} \n` +
      `<b>Descrição:</b> ${descricao} \n`;

    const response = await axios.get("https://api.telegram.org/bot" + process.env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
      params: {
        chat_id: "-1002070883447",
        text: message,
        parse_mode: "HTML",
        disable_notification: true,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar alerta:", error);
    throw new Error(`Erro ao enviar alerta: ${error.message}`);
  }
}

export { sendAlerts };