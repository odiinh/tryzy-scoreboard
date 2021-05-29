const Discord = require('discord.js');
const client = new Discord.Client();
const HypixelAPI = require('hypixel-api');
const SQLite = require("better-sqlite3");
const sql = new SQLite("./leaderboard.sqlite3");
const creds = require("./creds.json")

const Hclient = new HypixelAPI(creds.hypixel)
client.login(creds.discord);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('#info | GET BOBROLLED');
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, points INTEGER, games INTEGER, wins INTEGER, losses INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  client.getScore = sql.prepare("SELECT * FROM scores WHERE id = ?");
  client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, points, games, wins, losses) VALUES (@id, @points, @games, @wins, @losses);");
});


client.on('message', msg => {
  if (msg.content === 'b!help') {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#0000f9')
      .setTitle(`Help!`)
      .setURL("https://www.youtube.com/watch?v=tet1RnG-toI")
      .setDescription(`Hello, I'm Tryzy Scoreboard. A bot dedicated to the Tryzy Bedwars Tounament!\n Here are my commands to help you use me!`)
      .addFields(
        { name: 'b!help', value: "`"+"Brings up this message in the executor's DMs."+"`"},
        { name: 'b!ping', value: "`"+"Pings the bot to see if its awake! It also tells you the current latency of the bot."+"`"},
        { name: 'b!bw [MC Username]', value: "`"+"Uses the Hypixel API to do a BedWars lookup on a player.\n*e.g. b!bw Technoblade* "+"`"},
        { name: 'b!sb [Number of results or all]', value: "`"+"Shows you the current tournament leaderboard!"+"`"},
        { name: 'b!myscore', value: "`"+"Shows you your current tournament stats! (Games, Points, Wins, Losses)."+"`"},
        { name: '\u200B', value: '\u200B' },
        { name: 'HOST COMMANDS: ONLY HOSTS CAN EXECUTE THESE COMMANDS!', value: '\u200B' },
        { name: 'b!addwin [Mention Member]', value: "`"+"Adds a win, point and game played to the specified user."+"`"},
        { name: 'b!addwin [Mention Member]', value: "`"+"Adds a loss and game played, and removes a point from specified user."+"`"},
      )
      .setTimestamp()
      .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif');

      msg.author.send(exampleEmbed);
  }
  if (msg.content.startsWith('b!bw ')) {

    const playername = msg.content.substr(5)

    Hclient.getPlayer('name', playername).then((playerdata) => {
      const KDR = playerdata.player.stats.Bedwars.kills_bedwars / playerdata.player.stats.Bedwars.deaths_bedwars

      const WLR = playerdata.player.stats.Bedwars.wins_bedwars / playerdata.player.stats.Bedwars.losses_bedwars
      
      const FKDR = playerdata.player.stats.Bedwars.final_kills_bedwars / playerdata.player.stats.Bedwars.final_deaths_bedwars

      const BBLR = playerdata.player.stats.Bedwars.beds_broken_bedwars / playerdata.player.stats.Bedwars.beds_lost_bedwars

      console.log(playerdata)
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#0000f9')
      .setTitle(`Stats for ${playerdata.player.displayname}`)
      .setThumbnail(`https://visage.surgeplay.com/face/${playerdata.player.uuid}.png`)
      .addFields(
        { name: 'Level', value: "`"+playerdata.player.achievements.bedwars_level+"`", inline: true },
        { name: 'Coins', value: "`"+playerdata.player.stats.Bedwars.coins+"`", inline: true },
        { name: 'Winstreak', value: "`"+playerdata.player.stats.Bedwars.winstreak+"`", inline: true },
        { name: 'Kills', value: "`"+playerdata.player.stats.Bedwars.kills_bedwars+"`", inline: true },
        { name: 'Deaths', value: "`"+playerdata.player.stats.Bedwars.deaths_bedwars+"`", inline: true },
        { name: 'KDR', value: "`"+KDR.toFixed(3)+"`", inline: true },
        { name: 'Wins', value: "`"+playerdata.player.stats.Bedwars.wins_bedwars+"`", inline: true },
        { name: 'Losses', value: "`"+playerdata.player.stats.Bedwars.losses_bedwars+"`", inline: true },
        { name: 'WLR', value: "`"+WLR.toFixed(3)+"`", inline: true },
        { name: 'Final Kills', value: "`"+playerdata.player.stats.Bedwars.final_kills_bedwars+"`", inline: true },
        { name: 'Final Deaths', value: "`"+playerdata.player.stats.Bedwars.final_deaths_bedwars+"`", inline: true },
        { name: 'FKDR', value: "`"+FKDR.toFixed(3)+"`", inline: true },
        { name: 'Beds Broken', value: "`"+playerdata.player.stats.Bedwars.beds_broken_bedwars+"`", inline: true },
        { name: 'Beds Lost', value: "`"+playerdata.player.stats.Bedwars.beds_lost_bedwars+"`", inline: true },
        { name: 'BBLR', value: "`"+BBLR.toFixed(3)+"`", inline: true },
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
  if (msg.content === 'b!ping') {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#0000f9')
      .setTitle(`PONG!`)
      .setURL("https://www.youtube.com/watch?v=tet1RnG-toI")
      .setDescription(`Latency is ${Date.now() - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
      .setTimestamp()
      .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif');

      msg.channel.send(exampleEmbed);
  }
  if (msg.content.startsWith('b!myscore')) {
    try {
      score = client.getScore.get(msg.author.id);
      if (!score) {
        score = {
          id: msg.author.id,
          points: 0,
          games: 0,
          wins: 0,
          losses: 0
        }
      }
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#00f000')
      .setTitle(msg.author.username)
      .addField(examplEmbed.addField(client.users.cache.get(score.id).tag, "Points: `"+score.points+"` Games: `"+score.games+"` Wins: `"+score.wins+"` Losses: `"+score.losses+"`"))
      
      msg.channel.send(exampleEmbed);

      client.setScore.run(score);

    } catch (error){
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle(String(error))
      .setDescription("**Make sure you mentioned the user!**\n*If you still get this problem, create a support ticket!*")
      msg.channel.send(exampleEmbed);
  
    }
  }
  if (msg.content.startsWith("b!sb ")) {
    try {
      msg.guild.members.fetch()
      const params = msg.content.substr(5)
      if (!params) {
        const embed = new Discord.MessageEmbed()
        .setTitle("Define Amount")
        .setDescription(`Please specify the amount of results you would like, e.g. b!sb 10 or b!sb all`)
        .setColor('#f00000')
        .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif');
        msg.channel.send(embed)
      }
      if (params == "all") {
        const board = sql.prepare(`SELECT * FROM scores ORDER BY points DESC;`).all()
        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setDescription(`Our FULL leaderboard!`)
        .setColor('#0000f9')
        .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif')
        var i = 1;
        for(const data of board) {
            embed.addField(i+": "+client.users.cache.get(data.id).tag, "Points: `"+data.points+"` Games: `"+data.games+"` Wins: `"+data.wins+"` Losses: `"+data.losses+"`");
            i++
          }
        msg.channel.send(embed)
      }

      else if (parseInt(params) >= 1) {
        const board = sql.prepare(`SELECT * FROM scores ORDER BY points DESC LIMIT ${params};`).all()
        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setDescription(`The top ${params} entries from our leaderboard!`)
        .setColor('#0000f9')
        .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif')
        var i = 1;
        for(const data of board) {
            embed.addField(i+": "+client.users.cache.get(data.id).tag, "Points: `"+data.points+"` Games: `"+data.games+"` Wins: `"+data.wins+"` Losses: `"+data.losses+"`");
            i++
          }
        msg.channel.send(embed)
      }
      else {
        const embed = new Discord.MessageEmbed()
        .setTitle("ERROR")
        .setDescription(`Please make sure your amount of results requested is a **whole number greater than 1**!`)
        .setColor('#ff0000')
        .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif')
        msg.channel.send(embed)
      }
    } catch (error){
      console.log(error)
      const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle(error)
      .setDescription("*If you still get this problem, DM Odiin#0001 (<@263962785480704000>)*")
      msg.channel.send(exampleEmbed);
    }
  }
  if (msg.content.startsWith('b!addwin ') || msg.content.startsWith('b!aw ')) {
    if (msg.guild.member(msg.author.id).roles.cache.has("808061512434450442")){
      try {
        const userID = msg.mentions.users.first().id
        console.log(userID)
        score = client.getScore.get(userID);
        if (!score) {
          score = {
            id: userID,
            points: 3,
            games: 1,
            wins: 1,
            losses: 0
          }
          client.setScore.run(score);
        }
        else {
          score.wins++;
          score.points++;
          score.points++;
          score.points++;
          score.games++;
          client.setScore.run(score);
        }
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#00f000')
        .setTitle(`DONE!`)
        .setDescription(`Added win to <@${userID}>`)
        .setTimestamp()
        .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif');
        msg.channel.send(exampleEmbed);
      } catch (error){
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(String(error))
        .setDescription("Make sure you mentioned the user!\n*If you still get this problem, create a support ticket!*")
        msg.channel.send(exampleEmbed);
    
      }
    } else {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle("Permission Denied")
        .setDescription("**If you're supposed to be doing this, make sure you have the <@&808061512434450442> role and in the Tryzy Tournaments Server!**")
        msg.channel.send(exampleEmbed);
    }
  }
  if (msg.content.startsWith('b!addloss ') || msg.content.startsWith('b!al ')) {
    if (msg.guild.member(msg.author.id).roles.cache.has("808061512434450442")){
      try {
        const userID = msg.mentions.users.first().id
        console.log(userID)
        score = client.getScore.get(userID);
        if (!score) {
          score = {
            id: userID,
            points: -1,
            games: 1,
            wins: 0,
            losses: 1
          }
          client.setScore.run(score);
        }
        else {
          score.losses++;
          score.points--;
          score.games++;
          client.setScore.run(score);
        }
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#f00000')
        .setTitle(`DONE!`)
        .setDescription(`Added loss to <@${userID}>`)
        .setTimestamp()
        .setFooter('By Odiin#0001.', 'https://i.imgur.com/gtSR0hn.gif');
        msg.channel.send(exampleEmbed);
      } catch (error){
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(String(error))
        .setDescription("**Make sure you mentioned the user!**\n*If you still get this problem, create a support ticket!*")
        msg.channel.send(exampleEmbed);
      }
    } else {
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle("Permission Denied")
        .setDescription("**If you're supposed to be doing this, make sure you have the <@&808061512434450442> role and in the Tryzy Tournaments Server!**")
        msg.channel.send(exampleEmbed);
    }
  }
  })


