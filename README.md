Tryzy Scoreboard Discord Bot
============================

This repository contains the code for a Discord bot designed for the Tryzy Bedwars Tournament. The bot is built with Discord.js and uses the Hypixel API and SQLite.

Features
--------

The Tryzy Scoreboard bot can do the following:

*   Look up BedWars stats for a given Minecraft username using the Hypixel API.
*   Show the current tournament leaderboard.
*   Show an individual's tournament stats (Games, Points, Wins, Losses).
*   Add wins or losses to a player's tournament stats (host-only commands).

Installation
------------

1.  Clone this repository.
2.  Install the required dependencies using `npm install`.
3.  Create a `creds.json` file in the project root directory with the following format:
    
    `{   "discord": "<your discord bot token>",   "hypixel": "<your hypixel api key>" }`
    
4.  Run the bot using `node index.js`.

Note: You will need to have a Discord bot account and a Hypixel API key to use this bot.

Usage
-----

*   `b!help`: Shows the list of available commands.
*   `b!bw [MC Username]`: Looks up the BedWars stats for the specified Minecraft player.
*   `b!sb [Number of results or all]`: Shows the current tournament leaderboard.
*   `b!myscore`: Shows the tournament stats for the user who entered the command.
*   `b!addwin [Mention Member]`: Adds a win, point, and game played to the specified user (host-only command).
*   `b!addloss [Mention Member]`: Adds a loss and game played, and removes a point from the specified user (host-only command).

If you have any questions or feedback, feel free to reach out to me on Discord.
