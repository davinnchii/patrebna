import { bot } from '../bot';
import db from '../../database';
import { IUser, ICollection } from '../../database';

export async function commandChangeurl(
  users: ICollection<IUser>,
  usersIds: string[],
): Promise<void> {
  bot.onText(/\/changeurl/, async (ctx) => {
    users = await db.getUsers();
    usersIds = users ? Object.keys(users) : [];

    const { id } = ctx.chat;
    if (usersIds.includes(id.toString())) {
      bot.sendMessage(id, '💬 Хотите изменить ссылку?', {
        reply_markup: {
          inline_keyboard: [
            [{ text: ' 👌 Да, хочу!', callback_data: 'change' }],
            [{ text: ' ◀ Назад', callback_data: 'back' }],
          ],
        },
      });
    } else {
      bot.sendMessage(
        id,
        '😟 Вы еще не зарегистрированы! Что бы начать взаимодействовать с ботом выберите команду <a>/start</a>',
        { parse_mode: 'HTML' },
      );
    }
  });
}
