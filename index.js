const Discord = require('discord.js');
const client = new Discord.Client();
const HypixelAPI = require('hypixel-api')

const Hclient = new HypixelAPI('b8318af6-f21b-4c73-acb8-9f8cd51d042b')
client.login('ODA4Mjg5NzMyNDI0NjMwMzAy.YCEYeQ.w2qydKwrsEoPnebjIqeArD2yq0U');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('!bw | GET BOBROLLED', { type: 'PLAYING' });
});


client.on('message', msg => {
  if (msg.content.startsWith('!bw ')) {

    const playername = msg.content.substr(4)

    Hclient.getPlayer('name', playername).then((playerdata) => {
      const KDR = playerdata.player.stats.Bedwars.kills_bedwars / playerdata.player.stats.Bedwars.deaths_bedwars

      const WLR = playerdata.player.stats.Bedwars.wins_bedwars / playerdata.player.stats.Bedwars.losses_bedwars
      
      const FKDR = playerdata.player.stats.Bedwars.final_kills_bedwars / playerdata.player.stats.Bedwars.final_deaths_bedwars

      const BBLR = playerdata.player.stats.Bedwars.beds_broken_bedwars / playerdata.player.stats.Bedwars.beds_lost_bedwars

      console.log(playerdata)
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#0000ff')
      .setTitle(`Stats for ${playerdata.player.displayname}`)
      .setThumbnail(`https://visage.surgeplay.com/face/${playerdata.player.uuid}.png`)
      .addFields(
        { name: 'Level', value: playerdata.player.achievements.bedwars_level, inline: true },
        { name: 'Coins', value: playerdata.player.stats.Bedwars.coins, inline: true },
        { name: 'Winstreak', value: playerdata.player.stats.Bedwars.winstreak, inline: true },
        { name: 'Kills', value: playerdata.player.stats.Bedwars.kills_bedwars, inline: true },
        { name: 'Deaths', value: playerdata.player.stats.Bedwars.deaths_bedwars, inline: true },
        { name: 'KDR', value: KDR.toFixed(3), inline: true },
        { name: 'Wins', value: playerdata.player.stats.Bedwars.wins_bedwars, inline: true },
        { name: 'Losses', value: playerdata.player.stats.Bedwars.losses_bedwars, inline: true },
        { name: 'WLR', value: WLR.toFixed(3), inline: true },
        { name: 'Final Kills', value: playerdata.player.stats.Bedwars.final_kills_bedwars, inline: true },
        { name: 'Final Deaths', value: playerdata.player.stats.Bedwars.final_deaths_bedwars, inline: true },
        { name: 'FKDR', value: FKDR.toFixed(3), inline: true },
        { name: 'Beds Broken', value: playerdata.player.stats.Bedwars.beds_broken_bedwars, inline: true },
        { name: 'Beds Lost', value: playerdata.player.stats.Bedwars.beds_lost_bedwars, inline: true },
        { name: 'BBLR', value: BBLR.toFixed(3), inline: true },
      )
      .setTimestamp()
      .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif');

      msg.channel.send(exampleEmbed);







    }).catch((err) => {
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle(String(err))
      msg.channel.send(exampleEmbed);

    })
  }
});


