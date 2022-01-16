const { MessageEmbed } = require("discord.js");
const permission = require("../custom/permission");

module.exports = (client, config) => {

    client.on('messageCreate',async (message) => {
        if (message.author.id === client.user.id) {
            return;
        }

        const bugs = config.bugs;

        for (element in bugs) {
            if (message.channelId === bugs[element]) {
                const embed = new MessageEmbed()
                .setTitle(element + " Issue")
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor("#fcba03")
                .setDescription(message.content)
                .addField("Status", "Open", true)
                .setTimestamp(Date.now())
                .setFooter("React to edit | ✅ Solved - ❌ Invalid",client.user.avatarURL());

                message.delete();

                let msg = await message.channel.send({ embeds: [embed] });

                msg.react("✅")
                .then(() => msg.react("❌"))
                .catch(error => console.error('One of the emojis failed to react:', error));

                return;

            }
        }
    })

    client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.partial) {
            await reaction.fetch()
        }

        if (user.id === client.user.id) {
            return;
        }

        if (reaction.message.author.id !== client.user.id) {
            return;
        }

        const bugs = config.bugs;

        for (element in bugs) {
            if (reaction.message.channelId === bugs[element]) {
                switch (reaction.emoji.name) {
                    case "❌":
                        reaction.users.remove(user)
                        if (permission.isDev(config,user)) {
                            reaction.message.edit({ embeds: [prepareEmbed("#781111", "Invalid", reaction.message.embeds[0])] })
                        }
                        break;
                    case "✅":
                        reaction.users.remove(user)
                        if (permission.isDev(config,user)) {
                            reaction.message.edit({ embeds: [prepareEmbed("#0ca82b", "Solved", reaction.message.embeds[0])] })
                        }
                        break;
                    default:
                        reaction.users.remove(user)
                        break;
                }
            }
        }
    })

}

function prepareEmbed(color, status, embed) {

    embed.fields = [];
    embed.addField("Status", status, true);
    embed.setColor(color);

    return embed;
}