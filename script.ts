import TelegramBot from 'node-telegram-bot-api';

import { checkingGraphqlHealth, checking200Status } from './src/tasks';
import { getAPIs, getGraphqlAPIs, getInitialUsers } from './src/utils';

const token: string = process.env.TELEGRAM_BOT_TOKEN!;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

const bot: TelegramBot = new TelegramBot(token, { polling: true });

let subscribedUsersId: number[] = getInitialUsers();

bot.on('message', (msg) => {
  // console.log(msg);
  const chatId = msg.chat.id;

  if (msg.text === '/subscribe discoverydealer') {
    if (!subscribedUsersId.includes(chatId)) {
      subscribedUsersId.push(chatId);
      bot.sendMessage(chatId, 'You are subscribed to discovery');
    } else {
      bot.sendMessage(chatId, 'You already subscribed to discovery');
    }
  } else {
    // Send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
  }
});

setInterval(async () => {
  for (let subscribedUserId of subscribedUsersId) {
    for (let api of getAPIs()) {
      await checking200Status(bot, subscribedUserId, api);
    }

    for (let graphqlApi of getGraphqlAPIs()) {
      await checkingGraphqlHealth(bot, subscribedUserId, graphqlApi);
    }
  }
}, 5 * 60 * 1000);
