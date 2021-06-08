const Discord = require('discord.js');
const YAML = require('yaml');
const fs = require('fs');

// const configFile = fs.readFileSync('./config.yml', 'utf8')
// const config = YAML.parse(configFile);
const config = process.env;
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
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