module.exports = {
    name: "removefixed",
    execute: async (interaction,client) => {
        const channel = interaction.options.getChannel("channel");
        const messages = await channel.messages.fetch({ limit: 10 });

        await interaction.deferReply();

        messages.forEach(message => {
            const embeds = message.embeds;

            if (embeds.length > 0) {
                const embed = embeds[0];
                const fields = embed.fields;
                
                for (const field of fields) {
                    if (field.name === "Status" && field.value === "Solved") {
                        message.delete();
                        return;                        
                    }
                }
            }

        });

        interaction.editReply("Succesfully deleted " + messages.size + " messages.");
    }
}