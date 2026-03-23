#!/usr/bin/env node
/**
 * Poet Battle Bot - Telegram бот для голосования
 * @poetbattlebot
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Config (env override supported)
const BOT_TOKEN = process.env.BATTLE_BOT_TOKEN;
const NOTION_KEY = process.env.BATTLE_NOTION_KEY;
if (!BOT_TOKEN || !NOTION_KEY) {
  console.error('❌ Missing BATTLE_BOT_TOKEN or BATTLE_NOTION_KEY env vars');
  process.exit(1);
}
const NOTION_VERSION = '2022-06-28';

// Database IDs
const DB_ARTISTS = '306a74b651a8817ea7d6ecb45d706eed';
const DB_VOTES = '306a74b651a8816493dcefc530542f8a';
const DB_SETTINGS = '306a74b651a881839f5bc8776481a934';

// Admin group
const ADMIN_GROUP = '@poetnotdead';
const ADMIN_GROUP_ID = -1002639063236;

// Bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Ignore "message is not modified" errors (user clicks same button twice)
function ignoreNotModified(err) {
  if (err?.message?.includes('message is not modified')) return;
  console.error('Telegram API error:', err.message);
}

// Global error handlers
bot.on('polling_error', (err) => {
  if (err?.message?.includes('ETIMEOUT') || err?.message?.includes('EFATAL')) {
    console.error('Polling error (will retry):', err.message);
  } else {
    console.error('Polling error:', err.message);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err?.message || err);
});

// ===== NOTION API =====

async function notionRequest(endpoint, method = 'GET', data = null) {
  const config = {
    method,
    url: `https://api.notion.com/v1/${endpoint}`,
    headers: {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    }
  };
  if (data) config.data = data;
  
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Notion API error:', error.response?.data || error.message);
    throw error;
  }
}

async function getSettings() {
  const data = await notionRequest(`databases/${DB_SETTINGS}/query`, 'POST');
  if (!data.results || data.results.length === 0) {
    return {battleNum: 1, status: 'Открыто', welcomeText: 'Голосование открыто'};
  }
  const page = data.results[0];
  return {
    battleNum: page.properties['Номер баттла']?.number || 1,
    status: page.properties['Статус']?.select?.name || 'Открыто',
    welcomeText: page.properties['Welcome текст']?.rich_text?.[0]?.plain_text || 'Голосование открыто'
  };
}

async function getArtistsByCategory(category) {
  const data = await notionRequest(`databases/${DB_ARTISTS}/query`, 'POST', {
    filter: {
      and: [
        {property: 'Категория', select: {equals: category}},
        {property: 'Активен', checkbox: {equals: true}}
      ]
    },
    sorts: [{property: '№', direction: 'ascending'}]
  });
  
  return data.results.map(page => ({
    id: page.id,
    num: page.properties['№']?.number,
    name: page.properties['Имя артиста']?.title?.[0]?.plain_text || '',
    work: page.properties['Название произведения']?.rich_text?.[0]?.plain_text || '',
    link: page.properties['Ссылка']?.url || '',
    votes: page.properties['Голосов']?.number || 0
  }));
}

async function getUserVote(userId, category) {
  const data = await notionRequest(`databases/${DB_VOTES}/query`, 'POST', {
    filter: {
      and: [
        {property: 'User ID', number: {equals: userId}},
        {property: 'Категория', select: {equals: category}}
      ]
    }
  });
  return data.results[0] || null;
}

async function saveVote(userId, username, firstName, category, artistId, artistName) {
  // Check if user already voted in this category
  const existingVote = await getUserVote(userId, category);
  
  if (existingVote) {
    // Update existing vote
    await notionRequest(`pages/${existingVote.id}`, 'PATCH', {
      properties: {
        'Артист': {relation: [{id: artistId}]},
        'Дата/время': {date: {start: new Date().toISOString()}}
      }
    });
    
    // Decrement old artist votes
    const oldArtistId = existingVote.properties['Артист']?.relation?.[0]?.id;
    if (oldArtistId && oldArtistId !== artistId) {
      const oldArtist = await notionRequest(`pages/${oldArtistId}`);
      const oldVotes = oldArtist.properties['Голосов']?.number || 0;
      await notionRequest(`pages/${oldArtistId}`, 'PATCH', {
        properties: {'Голосов': {number: Math.max(0, oldVotes - 1)}}
      });
    }
  } else {
    // Create new vote
    await notionRequest('pages', 'POST', {
      parent: {database_id: DB_VOTES},
      properties: {
        'ID': {title: [{text: {content: `${userId}-${category}`}}]},
        'User ID': {number: userId},
        'Username': {rich_text: [{text: {content: username || ''}}]},
        'Имя пользователя': {rich_text: [{text: {content: firstName || ''}}]},
        'Категория': {select: {name: category}},
        'Артист': {relation: [{id: artistId}]},
        'Дата/время': {date: {start: new Date().toISOString()}}
      }
    });
  }
  
  // Increment artist votes
  const artist = await notionRequest(`pages/${artistId}`);
  const currentVotes = artist.properties['Голосов']?.number || 0;
  await notionRequest(`pages/${artistId}`, 'PATCH', {
    properties: {'Голосов': {number: currentVotes + 1}}
  });
}

async function getStats() {
  const [poetry, prose, music] = await Promise.all([
    getArtistsByCategory('Поэзия'),
    getArtistsByCategory('Проза'),
    getArtistsByCategory('Музыка')
  ]);
  
  const totalVotes = await notionRequest(`databases/${DB_VOTES}/query`, 'POST');
  const uniqueVoters = new Set(totalVotes.results.map(v => v.properties['User ID']?.number)).size;
  
  return {poetry, prose, music, uniqueVoters};
}

async function isAdmin(userId) {
  // Hardcoded admins
  const adminIds = [
    452865506,   // @matthewjester
    684746616,   // @kattebel
    5328248129   // @poetsnotdead
  ];
  if (adminIds.includes(userId)) return true;
  
  // Check group membership
  try {
    const member = await bot.getChatMember(ADMIN_GROUP_ID, userId);
    return member.status === 'creator' || member.status === 'administrator';
  } catch (error) {
    console.error('isAdmin check failed:', error.message);
    return false;
  }
}

async function closeVoting() {
  const data = await notionRequest(`databases/${DB_SETTINGS}/query`, 'POST');
  if (data.results && data.results.length > 0) {
    const settingsId = data.results[0].id;
    await notionRequest(`pages/${settingsId}`, 'PATCH', {
      properties: {'Статус': {select: {name: 'Закрыто'}}}
    });
  }
}

// ===== BOT HANDLERS =====

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const settings = await getSettings();
  
  if (settings.status === 'Закрыто') {
    return bot.sendMessage(chatId, 
      `Голосование завершено. Результаты будут объявлены позже\n\n` +
      `Просим подписаться на наши каналы 🙏\n\n` +
      `🔗 Ссылки\n` +
      `[Telegram](http://t.me/poetnotdead/)\n` +
      `[Instagram](https://www.instagram.com/poetnotdead)\n` +
      `[YouTube](https://youtube.com/@poetnotdead)\n` +
      `[Facebook](https://facebook.com/poetnotdead)\n` +
      `[TikTok](https://www.tiktok.com/@poetsnotdead)\n` +
      `[Threads](https://www.threads.com/@poetnotdead)\n` +
      `[X.com](https://x.com/poetnotdead)\n` +
      `[Site](https://poetnotdead.com/)`,
      {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      }
    );
  }
  
  bot.sendMessage(chatId, settings.welcomeText, {
    reply_markup: {
      inline_keyboard: [
        [{text: '🎭 Поэзия', callback_data: 'cat_Поэзия'}],
        [{text: '📖 Проза', callback_data: 'cat_Проза'}],
        [{text: '🎵 Музыка', callback_data: 'cat_Музыка'}]
      ]
    }
  });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;
  
  const settings = await getSettings();
  if (settings.status === 'Закрыто') {
    return bot.answerCallbackQuery(query.id, {text: 'Голосование закрыто', show_alert: true});
  }
  
  // Category selection
  if (data.startsWith('cat_')) {
    const category = data.replace('cat_', '');
    const artists = await getArtistsByCategory(category);
    
    if (artists.length === 0) {
      bot.answerCallbackQuery(query.id, {text: 'В этой категории пока нет артистов', show_alert: true});
      return;
    }
    
    // Only artist name buttons with local numbers, one per row
    const buttons = artists.map((artist, index) => [{
      text: `${index + 1}. ${artist.name}`,
      callback_data: `vote_${category}_${artist.id}`
    }]);
    
    buttons.push([{text: '← Назад', callback_data: 'back_menu'}]);
    
    const categoryEmoji = {
      'Поэзия': '🎭',
      'Проза': '📖',
      'Музыка': '🎵'
    };
    
    bot.editMessageText(
      `${categoryEmoji[category]} ${category}\n\nВыберите артиста:`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: {inline_keyboard: buttons}
      }
    ).catch(ignoreNotModified);
  }
  
  // Vote
  else if (data.startsWith('vote_')) {
    const [, category, artistId] = data.split('_');
    const artists = await getArtistsByCategory(category);
    const artist = artists.find(a => a.id === artistId);
    
    if (!artist) {
      bot.answerCallbackQuery(query.id, {text: 'Артист не найден', show_alert: true});
      return;
    }
    
    await saveVote(
      userId,
      query.from.username,
      query.from.first_name,
      category,
      artistId,
      artist.name
    );
    
    const socialLinks = 
      `\n\nПодписывайтесь на наши каналы 🙏\n\n` +
      `🔗 Ссылки\n` +
      `[Telegram](http://t.me/poetnotdead/)\n` +
      `[Instagram](https://www.instagram.com/poetnotdead)\n` +
      `[YouTube](https://youtube.com/@poetnotdead)\n` +
      `[Facebook](https://facebook.com/poetnotdead)\n` +
      `[TikTok](https://www.tiktok.com/@poetsnotdead)\n` +
      `[Threads](https://www.threads.com/@poetnotdead)\n` +
      `[X.com](https://x.com/poetnotdead)\n` +
      `[Site](https://poetnotdead.com/)`;
    
    bot.editMessageText(
      `Спасибо! Вы проголосовали за ${artist.name} в категории ${category} ✅${socialLinks}`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{text: 'Главное меню', callback_data: 'back_menu'}]]
        }
      }
    ).catch(ignoreNotModified);
  }
  
  // Back to menu
  else if (data === 'back_menu') {
    bot.editMessageText(
      settings.welcomeText,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: {
          inline_keyboard: [
            [{text: '🎭 Поэзия', callback_data: 'cat_Поэзия'}],
            [{text: '📖 Проза', callback_data: 'cat_Проза'}],
            [{text: '🎵 Музыка', callback_data: 'cat_Музыка'}]
          ]
        }
      }
    ).catch(ignoreNotModified);
  }
  
  bot.answerCallbackQuery(query.id);
});

// Admin commands
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!(await isAdmin(userId))) {
    return bot.sendMessage(chatId, '⛔ Доступ запрещён. Только для админов группы @poetnotdead');
  }
  
  const settings = await getSettings();
  const {poetry, prose, music, uniqueVoters} = await getStats();
  
  let text = `📊 Статистика Баттл №${settings.battleNum}\n\n`;
  
  text += `🎭 Поэзия:\n`;
  poetry.sort((a, b) => b.votes - a.votes).forEach(a => {
    text += `  • ${a.name}: ${a.votes} голосов\n`;
  });
  
  text += `\n📖 Проза:\n`;
  prose.sort((a, b) => b.votes - a.votes).forEach(a => {
    text += `  • ${a.name}: ${a.votes} голосов\n`;
  });
  
  text += `\n🎵 Музыка:\n`;
  music.sort((a, b) => b.votes - a.votes).forEach(a => {
    text += `  • ${a.name}: ${a.votes} голосов\n`;
  });
  
  text += `\n👥 Всего проголосовало: ${uniqueVoters} человек`;
  
  bot.sendMessage(chatId, text);
});

bot.onText(/\/export/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!(await isAdmin(userId))) {
    return bot.sendMessage(chatId, '⛔ Доступ запрещён');
  }
  
  const {poetry, prose, music, uniqueVoters} = await getStats();
  const allVotes = await notionRequest(`databases/${DB_VOTES}/query`, 'POST');
  
  // JSON export
  const jsonData = {
    battle: 1,
    timestamp: new Date().toISOString(),
    categories: {
      poetry: poetry.map(a => ({name: a.name, work: a.work, votes: a.votes})),
      prose: prose.map(a => ({name: a.name, work: a.work, votes: a.votes})),
      music: music.map(a => ({name: a.name, work: a.work, votes: a.votes}))
    },
    total_voters: uniqueVoters,
    votes: allVotes.results.map(v => ({
      user_id: v.properties['User ID']?.number,
      username: v.properties['Username']?.rich_text?.[0]?.plain_text,
      category: v.properties['Категория']?.select?.name,
      timestamp: v.properties['Дата/время']?.date?.start
    }))
  };
  
  const jsonBuffer = Buffer.from(JSON.stringify(jsonData, null, 2));
  bot.sendDocument(chatId, jsonBuffer, {}, {filename: 'poet-battle-export.json'});
  
  // Text export
  let textExport = `📊 Экспорт результатов Баттл №1\n\n`;
  textExport += `🎭 Поэзия:\n`;
  poetry.sort((a, b) => b.votes - a.votes).forEach((a, i) => {
    textExport += `${i+1}. ${a.name} — "${a.work}": ${a.votes} голосов\n`;
  });
  textExport += `\n📖 Проза:\n`;
  prose.sort((a, b) => b.votes - a.votes).forEach((a, i) => {
    textExport += `${i+1}. ${a.name} — "${a.work}": ${a.votes} голосов\n`;
  });
  textExport += `\n🎵 Музыка:\n`;
  music.sort((a, b) => b.votes - a.votes).forEach((a, i) => {
    textExport += `${i+1}. ${a.name} — "${a.work}": ${a.votes} голосов\n`;
  });
  textExport += `\n👥 Всего: ${uniqueVoters} человек`;
  
  bot.sendMessage(chatId, textExport);
});

bot.onText(/\/close/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!(await isAdmin(userId))) {
    return bot.sendMessage(chatId, '⛔ Доступ запрещён');
  }
  
  await closeVoting();
  bot.sendMessage(chatId, '✅ Голосование закрыто');
});

bot.onText(/\/reset/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!(await isAdmin(userId))) {
    return bot.sendMessage(chatId, '⛔ Доступ запрещён');
  }
  
  bot.sendMessage(chatId, '🔄 Начинаю сброс базы...');
  
  try {
    // 1. Delete all votes
    let hasMore = true;
    let deletedVotes = 0;
    while (hasMore) {
      const votes = await notionRequest(`databases/${DB_VOTES}/query`, 'POST', {page_size: 100});
      if (votes.results.length === 0) { hasMore = false; break; }
      
      for (const vote of votes.results) {
        await notionRequest(`pages/${vote.id}`, 'PATCH', {archived: true});
        deletedVotes++;
      }
      hasMore = votes.has_more;
    }
    
    // 2. Reset all artist vote counts to 0
    let resetArtists = 0;
    const artists = await notionRequest(`databases/${DB_ARTISTS}/query`, 'POST', {page_size: 100});
    for (const artist of artists.results) {
      const currentVotes = artist.properties['Голосов']?.number || 0;
      if (currentVotes > 0) {
        await notionRequest(`pages/${artist.id}`, 'PATCH', {
          properties: {'Голосов': {number: 0}}
        });
        resetArtists++;
      }
    }
    
    // 3. Re-open voting
    const settings = await notionRequest(`databases/${DB_SETTINGS}/query`, 'POST');
    if (settings.results.length > 0) {
      await notionRequest(`pages/${settings.results[0].id}`, 'PATCH', {
        properties: {'Статус': {select: {name: 'Открыто'}}}
      });
    }
    
    bot.sendMessage(chatId, 
      `✅ Сброс завершён!\n\n` +
      `🗑 Удалено голосов: ${deletedVotes}\n` +
      `🔄 Обнулено артистов: ${resetArtists}\n` +
      `📖 Статус: Открыто\n\n` +
      `Голосование готово к новому раунду.`
    );
  } catch (error) {
    console.error('Reset error:', error.message);
    bot.sendMessage(chatId, `❌ Ошибка при сбросе: ${error.message}`);
  }
});

console.log('✅ Poet Battle Bot запущен!');
console.log('📱 @poetbattlebot');
