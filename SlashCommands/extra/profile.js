const {
    Client,
    EmbedBuilder,
    MessageActionRow,
    MessageSelectMenu,
    MessageAttachment,
    ApplicationCommandType,
    ApplicationCommandOptionType
} = require("discord.js");
const {
    createCanvas,
    loadImage
} = require('canvas');
const Schema = require("../../models/user/profile");
const { DMY } = require("../../assets/api/time/index");

module.exports = {
    name: "profile",
    description: "View and modify user profile.",
    type: ApplicationCommandType.ChatInput,
    options: [{
            name: "view",
            description: "View your profile.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "user",
                description: "View a user's profile.",
                type: ApplicationCommandOptionType.User,
                required: false,
            }],
        },
        {
            name: "edit",
            description: "Edit your profile.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "name",
                description: "Change your name.",
                type: ApplicationCommandOptionType.String,
                required: false,
            }, {
                name: "descriminator",
                description: "Change your discriminator.",
                type: ApplicationCommandOptionType.String,
                required: false,
            }, {
                name: "descripton",
                description: "Change your description.",
                type: ApplicationCommandOptionType.String,
                required: false,
            }, {
                name: "status",
                description: "Change your status.",
                type: ApplicationCommandOptionType.String,
                required: false,
            }, {
                name: "status-type",
                description: "Change your status type.",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [{
                        name: "auto",
                        value: "auto",
                    },
                    {
                        name: "online",
                        value: "online",
                    },
                    {
                        name: "idle",
                        value: "idle",
                    },
                    {
                        name: "dnd",
                        value: "dnd",
                    },
                    {
                        name: "streaming",
                        value: "streaming",
                    },
                    {
                        name: "offline",
                        value: "offline",
                    },
                ]
            }, {
                name: "background",
                description: "Change your background.",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [{
                        name: "minecraft",
                        value: "minecraft",
                    },
                    {
                        name: "sky",
                        value: "sky",
                    },
                    {
                        name: "ocean",
                        value: "ocean",
                    },
                    {
                        name: "space",
                        value: "space",
                    }
                ]
            }],
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === "view") {
            let user = interaction.options.getUser('user');
            if (user) user = interaction.guild.members.cache.get(user.id);
            if (!user) user = interaction.member;

            // cirlcle avatar
            const canvasCircle = createCanvas(512, 512)
            const ctxCircle = canvasCircle.getContext('2d')

            ctxCircle.beginPath();
            ctxCircle.arc(256, 256, 256, 0, Math.PI * 2, true);
            ctxCircle.closePath();
            ctxCircle.clip();
            const circleUser = await loadImage(user.user.displayAvatarURL({ format: "png", size: 256 }));
            ctxCircle.drawImage(circleUser, 0, 0, 512, 512)

            // cirlce bot avatar
            const canvasCircleBot = createCanvas(512, 512)
            const ctxCircleBot = canvasCircleBot.getContext('2d')

            ctxCircleBot.beginPath();
            ctxCircleBot.arc(256, 256, 256, 0, Math.PI * 2, true);
            ctxCircleBot.closePath();
            ctxCircleBot.clip();
            const circleBot = await loadImage(client.user.displayAvatarURL({ format: "png", size: 256 }));
            ctxCircleBot.drawImage(circleBot, 0, 0, 512, 512)

            const canvas = createCanvas(512, 512)
            const ctx = canvas.getContext('2d')

            const data = await Schema.findOne({ User: user.user.id }).exec();
            if (!data) return interaction.followUp("You don't have a profile yet!");

            // Background
            let backgroundURL = data.Background;
            if (data.Background === "minecraft") backgroundURL = "./assets/profile/background/minecraft.jpg";
            if (data.Background === "sky") backgroundURL = "./assets/profile/background/sky.jpg";
            if (data.Background === "ocean") backgroundURL = "./assets/profile/background/ocean.jpg";
            if (data.Background === "space") backgroundURL = "./assets/profile/background/space.jpg";

            const background = await loadImage(backgroundURL)
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            // Shadow
            const shadow = await loadImage("./assets/profile/shadow/shadow.png");
            ctx.drawImage(shadow, 0, 0, 512, 512)

            // Avatar
            const userdisplay = await loadImage(canvasCircle.toBuffer());
            ctx.drawImage(userdisplay, 13, 15, 150, 150)

            // Status
            let statusImg = "./assets/profile/status/online.png";
            if (data.Statustype === "online") statusImg = "./assets/profile/status/online.png";
            if (data.Statustype === "idle") statusImg = "./assets/profile/status/idle.png";
            if (data.Statustype === "dnd") statusImg = "./assets/profile/status/dnd.png";
            if (data.Statustype === "streaming") statusImg = "./assets/profile/status/streaming.png";
            if (data.Statustype === "offline") statusImg = "./assets/profile/status/offline.png";

            if (data.Statustype === "auto") {
                try {
                    if (user.presence.status === "online") statusImg = "./assets/profile/status/online.png";
                    if (user.presence.status === "idle") statusImg = "./assets/profile/status/idle.png";
                    if (user.presence.status === "dnd") statusImg = "./assets/profile/status/dnd.png";
                    if (user.presence.status === "streaming") statusImg = "./assets/profile/status/streaming.png";
                } catch (err) {
                    statusImg = "./assets/profile/status/offline.png";
                }
            }

            const status = await loadImage(statusImg)
            ctx.drawImage(status, 13, 15, 150, 150)

            // Owner Avatar
            if (client.config.bot.owner.includes(user.user.id)) {
                const botdisplay = await loadImage(canvasCircleBot.toBuffer());
                ctx.drawImage(botdisplay, 120, 120, 40, 40)
            }

            // server owner
            const serverOwner = await interaction.guild.fetchOwner();
            if (serverOwner.id === user.user.id) {
                const owner = await loadImage("./assets/profile/extra/crown.png");
                ctx.drawImage(owner, 13, 120, 40, 40)
            }

            // Username and discriminator
            ctx.font = '45px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.fillText(`${data.Name}#${data.Descriminator}`, 167, 110)

            // Status
            ctx.font = '15px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#C7C7C7";
            ctx.textAlign = "left";
            ctx.fillText(`${data.Status}`, 170, 135)

            // Description
            ctx.font = '20px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.fillText(`${data.Description.slice(0, 55)}`, 13, 200)

            // Description p2
            ctx.font = '20px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.fillText(`${data.Description.slice(55, 107)}`, 13, 230)

            // Description p3
            ctx.font = '20px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.fillText(`${data.Description.slice(107)}`, 13, 260)

            // XP
            ctx.font = '20px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#AAAAAA";
            ctx.textAlign = "left";
            ctx.fillText(`XP: ${String(data.XP)}/${String(data.MaxXP)}`, 20, 325);

            const percent = Math.round(data.XP / data.MaxXP * 100);

            // Level text
            ctx.font = '20px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#AAAAAA";
            ctx.textAlign = "left";
            ctx.fillText(`Level: ${String(data.Level)}`, 20, 300);

            // Level bar
            ctx.beginPath();
            ctx.rect(185, 285, 300, 40);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            // Level bar fill
            ctx.beginPath();
            ctx.rect(185, 285, (100 * (percent / 100)) * 3, 40);
            ctx.fillStyle = "#00ff00";
            ctx.fill();

            // Level bar outline
            ctx.beginPath();
            ctx.rect(185, 285, 300, 40);
            ctx.strokeStyle = "#000000";
            ctx.stroke();

            // Level bar text
            ctx.font = 'italic 26px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.fillText(`${percent}%`, 195, 315);

            // CreatedAT
            ctx.font = '15px Arial'
            ctx.rotate(0)
            ctx.fillStyle = "#AAAAAA";
            ctx.textAlign = "left";
            ctx.fillText(DMY(), 15, 490);

            const attachment = new MessageAttachment(canvas.toBuffer(), "profile.jpg");
            interaction.followUp({
                files: [attachment]
            });

        } else if (subCommand === "edit") {
            const data = await Schema.findOne({ User: interaction.member.user.id }).exec();
            if (!data) return interaction.followUp("You don't have a profile yet!");

            if (interaction.options.getString('name')) {
                const name = interaction.options.getString('name');
                if (name.length > 9) return interaction.followUp("Your name is too long!");
                data.Name = name;
            }
            if (interaction.options.getString('descriminator')) {
                const descriminator = interaction.options.getString('descriminator');
                if (descriminator.length !== 4) return interaction.followUp("Discriminator must be 4 characters!");
                if (isNaN(Number(descriminator))) return interaction.followUp("Discriminator must be a number!");
                data.Descriminator = Number(descriminator);
            }
            if (interaction.options.getString('descripton')) {
                const description = interaction.options.getString('descripton');
                if (description.length > 129) return interaction.followUp("Your description is too long!");
                data.Description = description;
            }
            if (interaction.options.getString('status')) {
                const status = interaction.options.getString('status');
                if (status.length > 43) return interaction.followUp("Status must be less than 129 characters!"); 
                data.Status = status;
            }
            if (interaction.options.getString('status-type')) {
                const statusType = interaction.options.getString('status-type');
                if (!["online", "idle", "dnd", "streaming", "offline", "auto"].includes(statusType)) return interaction.followUp("Invalid status type!");
                data.Statustype = statusType;
            }
            if (interaction.options.getString('background')) {
                const background = interaction.options.getString('background');
                if (!["minecraft", "sky", "ocean", "space"].includes(background)) return interaction.followUp("Invalid background!");
                data.Background = background;
            }

            data.save();
            return interaction.followUp("Profile updated!");
        }
    }
}