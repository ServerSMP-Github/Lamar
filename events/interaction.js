const pollSchema = require('../models/server/poll-cmd');
const client = require("../index");

const { getFileList } = require("../assets/api/file");

client.on("interactionCreate", async (interaction) => {
    const eventFiles = await getFileList(`${process.cwd()}/events/interactionCreate`, { type: ".js", recursively: true });
    eventFiles.map((value) => require(value)(interaction));

    if (interaction.isButton()) {
        if (interaction.customId.slice(0, 4) === 'poll') {
            let pollData = await pollSchema.findOne({ messageId: interaction.message.id })

            if (!pollData) return

            if (pollData) {
                var obj = pollData.users;
                let index = obj?.findIndex((obj => obj.number === interaction.customId.slice(4) && obj.user === interaction.user.id))

                if (index === -1) {

                    pollData = await pollSchema.findOneAndUpdate({ messageId: interaction.message.id }, {
                        $push: {
                            users: { number: interaction.customId.slice(4), user: interaction.user.id },
                        },
                    })

                    let irows = interaction.message.components

                    for (let i = 0; i < irows.length; i++) {

                        let index2 = irows[i].components.findIndex(obj => obj.customId === interaction.customId)

                        if (index2 === -1) {
                            continue;
                        } else {

                            let num = Number(irows[i].components[index2].label)

                            irows[i].components[index2].label = num + 1;

                            interaction.update({ components: irows })

                        }
                    }
                } else {

                    pollData = await pollSchema.findOneAndUpdate({ messageId: interaction.message.id }, {
                        $pull: {
                            users: { number: interaction.customId.slice(4), user: interaction.user.id },
                        },
                    })

                    let irows = interaction.message.components

                    for (let i = 0; i < irows.length; i++) {

                        let index2 = irows[i].components.findIndex(obj => obj.customId === interaction.customId)

                        if (index2 === -1) {
                            continue;
                        } else {

                            let num = Number(irows[i].components[index2].label)

                            irows[i].components[index2].label = num - 1;

                            interaction.update({ components: irows })
                        }
                    }

                }
            }

        }

    }

});
