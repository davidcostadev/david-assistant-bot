import { request, gql, ClientError } from 'graphql-request';
import TelegramBot from 'node-telegram-bot-api';

const document = gql`
  query health {
    health
  }
`;

export async function requestHealth(url: string) {
  try {
    const response = await request<{ health: string }>(url, document);

    return response.health;
  } catch (error) {
    if (error instanceof ClientError) {
      const message = error.message;

      throw new Error(message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error');
    }
  }
}

const emojiFailed = '\u{1F6D1}';
const emojiSuccess = '\u{2705}';

export async function checkingGraphqlHealth(
  bot: TelegramBot,
  subscribedUserId: number,
  url: string
) {
  try {
    const startTime = Date.now();
    const response = await requestHealth(url);
    const endTime = Date.now();
    const respondedIn = endTime - startTime;
    // await bot.sendMessage(
    //   subscribedUserId,
    //   `${emojiSuccess} Health check on ${url} is ok\n result: ${response}\n responded in: ${respondedIn}ms`
    // );
  } catch (error) {
    console.error(error);
    await bot.sendMessage(subscribedUserId, `${emojiFailed} Failed health check on ${url}`);
  }
}

export async function checking200Status(bot: TelegramBot, subscribedUserId: number, url: string) {
  try {
    const startTime = Date.now();
    const response = await fetch(url);
    const endTime = Date.now();
    const respondedIn = endTime - startTime;
    if (response.status === 200) {
      // await bot.sendMessage(
      //   subscribedUserId,
      //   `${emojiSuccess} Health check on ${url} is ok\n responded in: ${respondedIn}ms`
      // );
    } else {
      await bot.sendMessage(
        subscribedUserId,
        `${emojiFailed} Failed health check on ${url}\n responded in: ${respondedIn}ms\n status: ${response.status}`
      );
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(subscribedUserId, `${emojiFailed} Failed health check on ${url}`);
  }
}
