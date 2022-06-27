module.exports = {
	name: 'guildMemberAdd',
	once: false,
execute: async (client, member) => {
    console.log(`Un nouveau membre a rejoint de le serveur Discord. (${member.user.tag})`)
    }
}