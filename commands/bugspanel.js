const permission = require('../custom/permission');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "bugspanel",
    description: "Send bugs panel",
    execute: async (message,args,client) => {
        if (!permission.isStaff(client.config,message.member)) {
            return;
        }

        if (args.length < 1) {
            message.channel.send(":x: Please insert a valid plugin name.")
            return;
        }

        const embed = new MessageEmbed()
        .setColor("#03befc")
        .setTitle(args[0] + " bugs")
        .setDescription(`This is where you can post your bugs to ${args[0]}. 
         In the format:

        > 1.Description
        > 2.The error itself (preferably a link to pastebin)
        `)
        .setFooter("Zombie_Striker Bugs Tracker", client.user.avatarURL())

        message.channel.send(embed);
    }
}