function isDev(config,user) {
    return JSON.parse(config.developers).includes(user.id);
}

function isStaff(config,member) {
    return member && member.roles && member.roles.cache.find(role => role.id === config.staff);
}

module.exports = {
    isDev: isDev,
    isStaff: isStaff
}