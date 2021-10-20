module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;
    
        const command = interaction.commandName;
    
        if (!client.commands.has(command)) return;
    
        try {
            client.commands.get(command).execute(interaction, client);
        } catch (error) {
            console.error(error);
        }
    });
};