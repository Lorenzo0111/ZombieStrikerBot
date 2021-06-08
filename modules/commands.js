module.exports = (client) => {
    client.on('message', async message => {
        if (!message.content.startsWith("!")) return;
    
        const args = message.content.slice("!".length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
    
        if (!client.commands.has(command)) return;
    
        try {
            client.commands.get(command).execute(message, args, client);
        } catch (error) {
            console.error(error);
        }
    });
};