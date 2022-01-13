const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js');
const spigot = require('../verifier/spigot');
const songoda = require('../verifier/songoda');

module.exports = {
    name: "verify",
    execute: async (interaction,client) => {
        const platform = interaction.options.getString("platform");
        const id = interaction.options.getString("id");

        await interaction.deferReply();

        let verified;
        let manual;
        let profile;

        if (platform === "spigot") {
            verified = await spigot.verify(interaction,id);
            manual = spigot.manual;
            profile = spigot.profile(id);
        } else if (platform === "songoda") {
            verified = await songoda.verify(interaction,id);
            manual = songoda.manual;
            profile = await songoda.profile(id);
        } else {
            interaction.editReply("Invalid platform name, you can only use songoda or spigotmc");
            return;
        }

        if (!verified) {
            return;
        }

        if (manual) {
            interaction.editReply("Done! I contacted our staff for manual verification.");
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('verify_' + id + "_" + interaction.user.id)
                        .setLabel('Confirm')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('deny_' + interaction.user.id)
                        .setLabel('Refuse')
                        .setStyle('DANGER')
                );
            
            const embed = new MessageEmbed()
            .setTitle("New pending verification")
            .setDescription("<@" + interaction.user.id + "> is waiting for manual verification.\n\n[Profile](" + profile + ")")
            .setColor("#fc8c03")
            
            const pending = await interaction.guild.channels.fetch(client.config.pending);
            if (!pending) {
                return console.error("Unable to find pending channel.")
            }

            pending.send({embeds:[embed],components:[row]});
            return;
        }
    }
}