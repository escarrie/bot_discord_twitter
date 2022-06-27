const { readdirSync } = require('fs');
const colors = require('colors');

module.exports = (client) => {
    // commands
    const loadCommands = (dir = "./commands/") => {
        readdirSync(dir).forEach(dirs => {
          const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

          for (const files of commands) {
            const getFileName = require(`../${dir}/${dirs}/${files}`);
            client.commands.set(getFileName.name, getFileName);
            console.log(`[COMMANDS]`.bold.red + ` Chargement de la commande :`.bold.white + ` ${getFileName.name}`.bold.red);
            if(!commands) return console.log(`[COMMANDS]`.bold.red + `Aucune commande dans : `.bold.yellow + `${files}`.bold.red)
          };
        });
    };
    loadCommands()
    console.log(`•----------•`.bold.black)

    // slashCommands
    const arrayOfSlashCommands = [];

    const loadSlashCommands = (dir = "./slashCommands/") => {
        readdirSync(dir).forEach(dirs => {
            const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const files of commands) {
                const getFileName = require(`../${dir}/${dirs}/${files}`);
                client.slashCommands.set(getFileName.name, getFileName);
                console.log(`[SLASH COMMANDS]`.bold.red + ` Chargement de la slashCommand :`.bold.white + ` ${getFileName.name}`.bold.red);
                arrayOfSlashCommands.push(getFileName);
            }
        })
    }
    loadSlashCommands();

    setTimeout(async () => {
        console.log(`[API]`.bold.white + ` Synchronisation des commandes avec l'API de Discord.`.bold.green)
        await client.application.commands.set(arrayOfSlashCommands);
    }, 5000)
    console.log(`•----------•`.bold.black)

    // events
    const loadEvents = (dir = "./events/") => {
        readdirSync(dir).forEach(dirs => {
            const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));
      
            for(const files of events) {
                const getFileName = require(`../${dir}/${dirs}/${files}`)
                client.on(getFileName.name, (...args) => getFileName.execute(...args, client))
                console.log(`[EVENTS]`.bold.red + ` Chargement de l'evènement :`.bold.white + ` ${getFileName.name}`.bold.red);
                if(!events) return console.log(`[EVENTS]`.bold.red + `Aucun évènement dans : `.bold.yellow + `${files}`.bold.red)
            }
        })
    }
    loadEvents();
    console.log(`•----------•`.bold.black)
}