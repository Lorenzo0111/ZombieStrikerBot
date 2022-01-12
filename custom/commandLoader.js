const CustomCommand = require('./CustomCommand');

function loadCommands(commands) {
    const loadedCommands = new Map();

    for (const command of commands) {
        const name = command.name;
        const onlyStaff = command.onlystaff;
        const args = command.args;
        const description = command.description;
        const result = command.result;

        const cmd = new CustomCommand(name,onlyStaff,args,description,result);
        loadedCommands.set(name, cmd);
        console.log("[+] Loaded custom command: " + name)
    }


    return loadedCommands;
}

module.exports = loadCommands;