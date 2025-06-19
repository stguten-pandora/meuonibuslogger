import telebot from "telebot";

const telegramBot = new telebot({
    token: process.env.TELEGRAM_BOT_TOKEN,
    polling: {
        interval: 1000,
        retryTimeout: 10000,
    },
});

export default telegramBot;
