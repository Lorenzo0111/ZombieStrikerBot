const {Client,Intents,Collection} = require('discord.js');
const fs = require('fs');

require('dotenv').config();

const config = process.env;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MEMBERS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();
client.config = config;


console.log('[»] Loading commands..\n');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	  client.commands.set(command.name, command);

    console.log("[+] Loaded " + command.name + " (" + file + ")")
}

// Custom modules

console.log("\n[»] Loading modules..\n");

fs.readdirSync('modules')
    .map(mod => {
      console.log("[+] Loaded " + mod)
      return `./modules/${mod}`;
    })
    .map(mod => require(mod))
    .forEach(mod => mod(client, config));

// main bot logic

client.once('ready', () => {
    client.user.setStatus('online');

    client.user.setActivity(config.status, { type: "WATCHING" });

	console.log('\n[»] Discord bot is now online!');

});

client.login(config.token);