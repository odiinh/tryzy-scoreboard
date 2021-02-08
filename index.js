const Discord = require('discord.js');
const client = new Discord.Client();
const HypixelAPI = require('hypixel-api')

const Hclient = new HypixelAPI('b8318af6-f21b-4c73-acb8-9f8cd51d042b')
client.login('ODA4Mjg5NzMyNDI0NjMwMzAy.YCEYeQ.w2qydKwrsEoPnebjIqeArD2yq0U');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
  if (msg.content.startsWith('!getPlayer ')) {
    const playername = msg.content.substr(11)
    Hclient.getPlayer('name', playername).then((player) => {
      console.log(player)
      msg.channel.send(String(player))
    }).catch((err) => {
      console.error('Error! ' + err)
    })
  }
});


