import { bot } from '../bot';

export async function commandTrackPackages(): Promise<void> {
  bot.onText(/\/track_packages/, async (ctx) => {
    const { id } = ctx.chat;
    await bot.sendMessage(
      id,
      'Теперь вы можете отслеживать местоположение вашей посылки в режиме реального времени, просто введя трек-номер. Наш бот автоматически отправит вам уведомление, как только произойдут изменения в ее расположении во время доставки.',
    );

    await bot.sendMessage(id, '✅ Отлично, давайте начнем отслеживать.', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ' 📍 Добавить трек-номер Евпрочта',
              callback_data: 'addTrack',
            },
          ],
          [{ text: ' ◀ Назад', callback_data: 'back' }],
        ],
      },
    });
  });
}
