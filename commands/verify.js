const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js');
const axios = require("axios").default;

module.exports = {
    name: "verify",
    execute: async (interaction,client) => {
        const id = interaction.options.getInteger("id");

        await interaction.deferReply();

        const {data} = await axios.get("https://api.spigotmc.org/simple/0.2/index.php?action=getAuthor&id="+id);       
        if (!data.id) {
            return interaction.editReply("Please insert your spigot id. You can find it in your spigot profile page: https://i.imgur.com/ctPXhqw.png");
        }
        
        if (!data.identities.discord || (interaction.user.id != data.identities.discord && interaction.user.tag != data.identities.discord)) {
            return interaction.editReply("Your SpigotMC account is not linked to your discord account. Please link it by setting your discord identity to " + interaction.user.tag + ".\nYou can do that by editing the field here: https://www.spigotmc.org/account/contact-details");
        }

        interaction.editReply("Done! I contacted our staff for manual verification.");
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('verify_' + data.id + "_" + interaction.user.id)
					.setLabel('Confirm')
					.setStyle('SUCCESS'),
                new MessageButton()
					.setCustomId('deny_' + interaction.user.id)
					.setLabel('Refuse')
					.setStyle('DANGER')
			);
        
        const embed = new MessageEmbed()
        .setTitle("New pending verification")
        .setDescription("<@" + interaction.user.id + "> is waiting for manual verification.\n\n[SpigotMC profile](https://spigotmc.org/members/" + id + ")")
        .setColor("#fc8c03")
        
        const pending = await interaction.guild.channels.fetch(process.env.pending);
        if (!pending) {
            return console.error("Unable to find pending channel.")
        }

        pending.send({embeds:[embed],components:[row]});
    }
}