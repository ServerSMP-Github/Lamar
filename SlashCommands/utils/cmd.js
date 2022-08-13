const {
    Client,
    CommandInteraction,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const Schema = require("../../models/server/cmd-slash");

module.exports = {
    name: "cmd",
    description: "Disable or enable a slash command.",
    type: ApplicationCommandType.ChatInput,
    userPermissions: ["MANAGE_GUILD"],
    options: [{
            name: "enable",
            description: "You can enable disabled Slash Command in your server",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "command",
                description: "Put your Slash Command",
                type: ApplicationCommandOptionType.String,
                required: true,
            }],
        },
        {
            name: "disable",
            description: "You can disable Slash Command in your server",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "command",
                description: "Put your Slash Command",
                type: ApplicationCommandOptionType.String,
                required: true,
            }],
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const subCommand = interaction.options.getSubcommand();
        
        const cmd = interaction.options.getString("command");
        if (subCommand === "enable") {
            if (!cmd) return interaction.followUp('Please specify a Slash Command');
            if (cmd === 'cmd-enable' || cmd === 'cmd-disable') return interaction.followUp({
                content: `You Can't disable \`${cmd}\`.`,
                ephemeral: true
            })
            if (!!client.slashCommands.get(cmd) === false) return interaction.followUp({
                content: 'This Slash Command does not exist',
                ephemeral: true
            });
            Schema.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    if (!data.Cmds.includes(cmd)) return interaction.followUp({
                        content: 'This Slash Command has already been enabled.',
                        ephemeral: true
                    });
                    if (data.Cmds.length === 1) {
                        data.delete();
                    } else data.Cmds.splice(data.Cmds.indexOf(cmd), 1);
                    data.save();
                } else return interaction.followUp({
                    content: 'There are no disabled slash commands.',
                    ephemeral: true
                });
                interaction.followUp({
                    content: `Command \`${cmd}\` has been enabled.`
                })
            });

        } else if (subCommand === "disable") {
            if (!cmd) return interaction.followUp('Please specify a Slash Command');
            if (cmd === 'cmd-enable' || cmd === 'cmd-disable') return interaction.followUp({
                content: `You Can't disable \`${cmd}\`.`,
                ephemeral: true
            })
            if (!!client.slashCommands.get(cmd) === false) return interaction.followUp({
                content: 'This Slash Command does not exist',
                ephemeral: true
            });
            Schema.findOne({
                Guild: interaction.guild.id
            }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    if (data.Cmds.includes(cmd)) return interaction.followUp({
                        content: 'This Slash Command has already been disabled.',
                        ephemeral: true
                    });
                    data.Cmds.push(cmd)
                } else {
                    data = new Schema({
                        Guild: interaction.guild.id,
                        Cmds: cmd
                    })
                }
                await data.save();
                interaction.followUp({
                    content: `Command \`${cmd}\` has been disabled.`
                })
            });

        }
    },
};