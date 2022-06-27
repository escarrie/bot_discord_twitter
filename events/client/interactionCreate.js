const colors = require('colors');

module.exports = {
	name: 'interactionCreate',
	once: true,
	execute: async (interaction, client) => {
        awaitSlashCommands();

        async function awaitSlashCommands() {
            if(interaction.isCommand()) {
                await interaction.deferReply({ ephemeral: false }).catch(() => {});

                const cmd = client.slashCommands.get(interaction.commandName);
                if(!cmd) {
                    return interaction.followUp({ content: `:x: • ${message.author} une erreur est survenue lors du chargement de l'interaction.` })
                }

                const args = [];

                for (let option of interaction.options.data) {
                    if (option.type === "SUB_COMMAND") {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        
                console.log(`[SLASH COMMANDS] `.bold.red + `/${cmd.name}`.bold.blue + ` à été executée.`.bold.white)
                cmd.execute(client, interaction, args);
            }
        }
    }
}