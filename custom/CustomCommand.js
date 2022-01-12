const { SlashCommandBuilder } = require('@discordjs/builders');
const permission = require('../custom/permission');

class CustomCommand {
    constructor(name, onlyStaff, args, description, result) {
        this.name = name;
        this.onlyStaff = onlyStaff;
        this.args = args;
        this.description = description;
        this.result = result;
    }

    async execute(interaction, client) {
        let result = this.result;

        await interaction.deferReply();
        
        if (this.onlyStaff && !permission.isStaff(client.config,interaction.member)) {
            interaction.editReply(":x: This command can only be executed by a staff member.");
            return;
        }
        
        for (const arg of this.args) {
            switch (arg.type) {
                case 'string':
                    result = result.replace("${" + arg.name + "}", interaction.options.getString(arg.name));
                    continue;
                case 'channel':
                    result = result.replace("${" + arg.name + "}", "<#" + interaction.options.getChannel(arg.name).id + ">");
                    continue;
                case 'role':
                    result = result.replace("${" + arg.name + "}", "<@&" + interaction.options.getRole(arg.name).id + ">");
                    continue;
                case 'user':
                    result = result.replace("${" + arg.name + "}", "<@" + interaction.options.getUser(arg.name).id + ">");
                    continue;
                case 'boolean':
                    result = result.replace("${" + arg.name + "}", interaction.options.getBoolean(arg.name) ? "true" : "false");
                    continue;
                case 'integer':
                    result = result.replace("${" + arg.name + "}", interaction.options.getInteger(arg.name).toString());
                    continue;
                case 'mentionable':
                    result = result.replace("${" + arg.name + "}", "<@" + interaction.options.getMentionable(arg.name).id + ">");
                    continue;
            }
        }

        interaction.editReply(result);     
    }

    asCommand() {
        let builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);

        for (const arg of this.args) {
            switch (arg.type) {
                case 'string':
                    builder.addStringOption((option) => asOption(arg,option));
                    break;
                case 'channel':
                    builder.addChannelOption((option) => asOption(arg,option));
                    break;
                case 'role':
                    builder.addRoleOption((option) => asOption(arg,option));
                    break;
                case 'user':
                    builder.addUserOption((option) => asOption(arg,option));
                    break;
                case 'boolean':
                    builder.addBooleanOption((option) => asOption(arg,option));
                    break;
                case 'integer':
                    builder.addIntegerOption((option) => asOption(arg,option));
                    break;
                case 'mentionable':
                    builder.addMentionableOption((option) => asOption(arg,option));
                    break;
            }
        }

        return builder.toJSON();
    }
}

function asOption(argument, option) {
    option.setName(argument.name);
    option.setDescription(argument.description);
    option.setRequired(true);

    return option;
}

module.exports = CustomCommand;