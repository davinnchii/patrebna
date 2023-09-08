import { bot } from '../telegram/bot';
import db from '../database';
import axios from 'axios';
import { parserAds } from '../parser/parserAds';
import { compareCollections, pause } from '../utils';

export default async function parseKufar(usersIds: string[]) {
  console.log(new Date().toLocaleTimeString('ru-RU'));
  for (const id of usersIds) {
    const url = await db.getUserUrl(id);
    let html = '';
    if (url) {
      try {
        const { data } = await axios.get(url);
        html = data;
      } catch (error) {
        console.error(error);
      }

      const typeUrlParser = await db.getUserTypeParser(id);
      const parserData = parserAds(typeUrlParser, html);

      const saveAds = await db.getSavedAds(id);
      const newIds = compareCollections(saveAds, parserData);

      const statusCollectionAds = await db.isAdsEmpty(id);
      for (const newId of newIds) {
        const data = parserData[newId];
        await db.setNewAd(data, id);
        await pause(2500);
        if (statusCollectionAds) {
          bot.sendPhoto(id, `${data.img_url}`, {
            caption: `Появилось новое объявление: <b>${
              data.title
            }</b>, c ценой <b>${data.price}</b>.\n<i>${
              data?.description ? data.description + '\n' : ''
            }</i><a href="${data.url}">Подробнее</a>`,
            parse_mode: 'HTML',
          });
        }
      }

      console.log(`Добавлено новых объявлений ${newIds.length} в базу`);
    }
  }
}
