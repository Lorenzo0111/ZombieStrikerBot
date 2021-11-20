const axios = require('axios').default;

async function verify(interaction,id) {
    const {data} = await axios.get("https://api.spigotmc.org/simple/0.2/index.php?action=getAuthor&id="+id+"&cb="+Date.now());       
    if (!data.id) {
        interaction.editReply("Please insert your spigot id. You can find it in your spigot profile page: https://i.imgur.com/ctPXhqw.png");
        return false;
    }
    
    if (!data.identities.discord || (interaction.user.id != data.identities.discord && interaction.user.tag != data.identities.discord)) {
        interaction.editReply("Your SpigotMC account is not linked to your discord account. Please link it by setting your discord identity to " + interaction.user.tag + ".\nYou can do that by editing the field here: https://www.spigotmc.org/account/contact-details\n**Discord field:** " + data.identities.discord);
        return false;
    }

    return true;
}

function profile(id) {
    return "https://www.spigotmc.org/members/" + id;
}

module.exports = {
    verify: verify,
    profile: profile,
    manual: true
}