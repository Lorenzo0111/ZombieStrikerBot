const permission = require('../custom/permission');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "bugspanel",
    execute: async (interaction,client) => {
        if (!permission.isStaff(client.config,interaction.member)) {
            return;
        }

        const name = interaction.options.getString("plugin");
        if (!name) {
            return;
        }

        const embed = new MessageEmbed()
        .setColor("#03befc")
        .setTitle(name + " bugs")
        .setDescription(`This is where you can post your bugs to ${name}. 
         In the format:

        > 1.Description
        > 2.The error itself (preferably a link to pastebin)
        `)
        .setFooter("Zombie_Striker Bugs Tracker", client.user.avatarURL())

        await interaction.reply({ content: 'Done!', ephemeral: true });
        interaction.channel.send({ embeds: [embed]});
    }
}