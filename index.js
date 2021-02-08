const Discord = require('discord.js');
const client = new Discord.Client();

client.login('ODA4Mjg5NzMyNDI0NjMwMzAy.YCEYeQ.w2qydKwrsEoPnebjIqeArD2yq0U');
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'rean') {
    msg.reply('CHOOOODE MUNCHERRRR');
  }
});

