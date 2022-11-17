const { CommandInteraction, Client, AttachmentBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'manipulate',
    description: 'Image manipulation',
    type: ApplicationCommandType.ChatInput,
    options: [{
            name: 'caution',
            description: "Create a caution sign!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'text',
                description: "The text that you want to be displayed in the caution sign",
                type: ApplicationCommandOptionType.String,
                required: true
            }],
        },
        {
            name: 'clown',
            description: "Make someone a clown!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: "The user that you want to make a clown into",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'gun',
            description: 'Get someones avatar holding a gun',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "The user that you want to hold the gun as",
                type: ApplicationCommandOptionType.User,
                required: false
            }],
        },
        {
            name: 'oogway',
            description: "Make an oogway quote meme!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'text',
                description: "The text that you want to be displayed in the oogway meme",
                type: ApplicationCommandOptionType.String,
                required: true
            }],
        },
        {
            name: 'pet',
            description: "Pet someone!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "The user that you want to pet",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'sadcat',
            description: "Make a sad cat meme!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'text',
                description: "The text that you want to be displayed in the sadcat meme",
                type: ApplicationCommandOptionType.String,
                required: true
            }],
        },
        {
            name: 'wanted',
            description: "Be wanted and have a large bounty",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "The user that you want to make wanted",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'ship',
            description: "Ship someone as a couple!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                    name: 'user1',
                    description: "The first user that you want to ship with the 2nd user",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'user2',
                    description: "The first user that you want to ship with the 1st user",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                }
            ]
        },
        {
            name: 'trigger',
            description: "Make a user triggered!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "The user that you want to make triggered",
                type: ApplicationCommandOptionType.User,
                required: false
            }]

        },
        {
            name: 'simp',
            description: "Give a user a simp stamp!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "The user that you want to make simp-stamped!",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'tweet',
            description: "Make a fake tweet!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                    name: 'text',
                    description: "The text that you want to tweet!",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'user',
                    description: 'The user that you want to fake tweet as!',
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: 'delete',
            description: "Permanently delete a user! 😳",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: "The user that you want to permantly delete! 😳",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'supreme',
            description: "Make someone look like a goat! 🐐",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: "The user that you want to make as a goat!🐐",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'shit',
            description: "Step on a ship!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'user',
                description: "The user that you want to make as a shit! 💩",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        },
        {
            name: 'gravestone',
            description: "Make a gravestone of a user!",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "The user that you want to make the gravestone in",
                type: ApplicationCommandOptionType.User,
                required: false
            }]
        }
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args, color) => {

        const unicode = (str) => {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/([^\w]+|\s+)/g, '-') // Replace space and other characters by hyphen
                .replace(/\-\-+/g, '-') // Replaces multiple hyphens by one hyphen
                .replace(/(^-+|-+$)/, ''); // Remove extra hyphens from beginning or end of the string
        }

        const subcommand = interaction.options.getSubcommand();
        const text = interaction.options.getString('text')?.trim()?.split(/ +/g)?.join("+");
        const member = interaction.options.getMember('user') || interaction.member;

        const user1 = interaction.options.getUser('user1');
        const user2 = interaction.options.getUser('user2');

        function displayResult(url, file_name) {
            return interaction.followUp({
                files: [new AttachmentBuilder(url, { name: file_name })]
            });
        }

        if (subcommand === 'caution') displayResult(`https://api.popcat.xyz/caution?text=${text}`, `caution-${interaction.user.id}.png`);
        else if (subcommand === 'clown') displayResult(`https://api.popcat.xyz/clown?image=${member.user.displayAvatarURL({format: 'png'})}`, `clown-${member.id}.png`);
        else if (subcommand === 'gun') displayResult(`https://api.popcat.xyz/gun?image=${member.user.displayAvatarURL({format: 'png'})}`, `gun-${member.user.id}.png`);
        else if (subcommand === 'oogway') displayResult(`https://api.popcat.xyz/oogway?text=${text}`, `oogway-${member.user.id}.png`);
        else if (subcommand === 'pet') displayResult(`https://api.popcat.xyz/pet?image=${member.user.displayAvatarURL({format: 'png'})}`, `pet-${member.id}.gif`);
        else if (subcommand === 'sadcat') displayResult(`https://api.popcat.xyz/sadcat?text=${text}`, `sadcat-${member.user.id}.png`);
        else if (subcommand === 'wanted') displayResult(`https://api.popcat.xyz/wanted?image=${member.user.displayAvatarURL({format: 'png'})}`, `wanted-${member.id}.png`);
        else if (subcommand === 'ship') displayResult(`https://api.popcat.xyz/ship?user1=${user1.displayAvatarURL({format: 'png'})}&user2=${user2.displayAvatarURL({format: 'png'})}`, `ship-${user1.id}-${user2.id}.png`);
        else if (subcommand === 'trigger') displayResult(`https://some-random-api.ml/canvas/triggered?avatar=${member.user.displayAvatarURL({format: 'png'})}`, `triggered-${member.id}.gif`);
        else if (subcommand === 'simp') displayResult(`https://api.popcat.xyz/simpstamp?image=${member.user.displayAvatarURL({format: 'png'})}`, `simpstamp-${member.id}.png`);
        else if (subcommand === 'tweet') displayResult(`https://some-random-api.ml/canvas/tweet?avatar=${member.user.displayAvatarURL({format: 'png' })}&comment=${text}&displayname=${unicode(`${member.displayName.slice(0, 14)}`)}&username=${unicode(`${member.user.username.slice(0, 14)}`)}`, `faketweet.png`);
        else if (subcommand === `delete`) displayResult(`https://luminabot.xyz/api/image/delete?image=${member.user.displayAvatarURL({format: 'png'})}`, `delete-${member.id}.png`);
        else if (subcommand === `supreme`) displayResult(`https://luminabot.xyz/api/image/supreme?image=${member.user.displayAvatarURL({format: 'png'})}`, `supreme-${member.id}.png`);
        else if (subcommand === `shit`) displayResult(`https://luminabot.xyz/api/image/steppedinshit?image=${member.user.displayAvatarURL({format: 'png'})}`, `steppedinshit-${member.id}.png`);
        else if (subcommand === 'gravestone') displayResult(`https://luminabot.xyz/api/image/gravestone?image=${member.user.displayAvatarURL({format: 'png'})}&username=${unicode(`${member.displayName}`)}`, `gravestone-${member.id}.png`);

    }
}
