const axios = require('axios').default;

async function verify(interaction,id) {
    const {data} = await axios.get("https://songoda.com/api/dashboard/products/qualityarmoryvehicles-custom-vehicles/payments?token=" + process.env.songoda + "&cb="+Date.now());       
    const buyers = data.data;

    for (let i = 0; i < buyers.length; i++) {
        if (buyers[i].username === id) {
            if (!buyers[i]['discord_data'] || buyers[i]['discord_data'].id !== interaction.user.id) {
                interaction.editReply("Your songoda account is not linked to your discord one. Link it by visiting this page: https://songoda.com/account/integrations");
                return false;
            }
            return true;
        }
    }

    interaction.editReply("I can't find your purchase. Is this an error? Contact a staff member");
    return false;
}

function profile(id) {
    return "https://www.songoda.com/members/" + id;
}

module.exports = {
    verify: verify,
    profile: profile,
    manual: false
}