module.exports = {
	name: 'guildMemberRemove',
	once: false,
execute: async (client, member) => {
    console.log(`Un membre vient de quitter le serveur Discord. (${member.user.tag})`)
    }
}