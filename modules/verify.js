module.exports = (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.message.author.id !== client.user.id) return;

        const data = interaction.customId.split("_");
        if (data.length < 2) return;

        if (data[0] === "deny") {
            const member = await interaction.guild.members.fetch(data[1]);
            if (!member) {
                return;
            }

            interaction.reply("The request from <@" + data[1] + "> has been denied.")
            interaction.message.delete();
            member.send("**Hello! Your spigot verification has been denied.**\nDo you bought any of our plugins? Contact our staff team.");
            return;
        }

        if (data[0] === "verify") {
            const member = await interaction.guild.members.fetch(data[2]);
            if (!member) {
                return;
            }

            interaction.reply("The request from <@" + data[2] + ">(https://spigotmc.org/members/" + data[1] + ") has been accepted.")
            interaction.message.delete();
            member.send("**Hello! Your spigot verification has been accepted.**\nNow you can ask support for our premium plugins.");
            
            const role = await interaction.guild.roles.fetch(process.env.verified);
            member.roles.add(role);
            return;
        }

    });
}