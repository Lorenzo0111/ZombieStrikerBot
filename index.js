const {Client,Intents,Collection} = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');

require('dotenv').config();

const config = process.env;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MEMBERS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Collection();
client.config = config;

const commands = [
  new SlashCommandBuilder()
	.setName('bugspanel')
	.setDescription('Send the bugs panel in the channel')
	.addStringOption(option =>
		option.setName('plugin')
			.setDescription('The plugin name')
			.setRequired(true)).toJSON(),

  new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Link your discord account to your spigot one.')
  .addIntegerOption(option =>
  option.setName('id')
  .setDescription('Your spigot id')
  .setRequired(true)).toJSON()
]; 

console.log('[»] Loading commands..\n');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);

  console.log("[+] Loaded " + command.name + " (" + file + ")")
}

for (const command of commands) {
  command.permission = [
    {
      id: Number(config.staff),
      type: 'ROLE',
      permission: true,
    },
  ];
  command.defaultPermission = false;
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	try {
		console.log('[|] Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(config.client, config.guild),
			{ body: commands },
		);

		console.log('[|] Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();


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

    client.user.setActivity(config.astatus, { type: "WATCHING" });

	console.log('\n[»] Discord bot is now online!');

});

client.login(config.token);