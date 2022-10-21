const { EmbedBuilder } = require("discord.js");

const { buttonPagination } = require("../../../assets/api/pagination");
const { randomHexColor } = require("../../../assets/api/color");

module.exports = {
    name: null,
    run: async (client, message, args) => {
        const prefix = await client.prefix(message);
        const randomColor = randomHexColor();

        const embed = new EmbedBuilder()
            .setTitle("Options - Documentation")
            .setDescription(`
                **Options**: list
                \`${prefix}options list\`

                **Prefix**: set
                \`${prefix}options prefix set !\`
                **Prefix**: reset
                \`${prefix}options prefix reset\`

                **Invite**: off
                \`${prefix}options invite off\`
                **Invite**: on
                \`${prefix}options invite on #channel\`

                **XP**: off
                \`${prefix}options xp off\`
                **XP**: on
                \`${prefix}options xp on\`
                **XP**: channel set
                \`${prefix}options xp channel set #channel\`
                **XP**: channel remove
                \`${prefix}options xp channel remove\`
                **XP** ping off
                \`${prefix}options xp ping off\`
                **XP** ping on
                \`${prefix}options xp ping on\`
                **XP** rate current
                \`${prefix}options xp rate current\`
                **XP** rate reset
                \`${prefix}options xp rate reset\`
                **XP** rate set
                \`${prefix}options xp rate set 6\`
                **XP** web off
                \`${prefix}options xp web off\`
                **XP** web on
                \`${prefix}options xp web on\`
                **XP** message off
                \`${prefix}options xp message off\`
                **XP** message on
                \`${prefix}options xp message on\`
                **XP** rankcard color set
                \`${prefix}options xp rankcard color set #hex\`
                **XP** rankcard color reset
                \`${prefix}options xp rankcard color reset\`
                **XP** rankcard status set
                \`${prefix}options xp rankcard status set [true or false]\`
                **XP** rankcard status reset
                \`${prefix}options xp rankcard status reset\`
                **XP** rankcard background set
                \`${prefix}options xp rankcard background set [image url]\`
                **XP** rankcard background reset
                \`${prefix}options xp rankcard background reset\`

                **Captcha**: on
                \`${prefix}options captcha on\`
                **Captcha**: off
                \`${prefix}options captcha off\`

                **NSFW**: off
                \`${prefix}options nsfw off\`
                **NSFW**: on
                \`${prefix}options nsfw on\`
                **NSFW**: channel set
                \`${prefix}options nsfw channel add #channel\`
                **NSFW**: channel remove
                \`${prefix}options nsfw channel remove [all or #channel]\`

                **Chatbot**: off
                \`${prefix}options chatbot off\`
                **Chatbot**: on
                \`${prefix}options chatbot on #channel\`

                **ModLogs**: remove
                \`${prefix}options modlogs remove\`
                **ModLogs**: set
                \`${prefix}options modlogs set #channel\`
                **ModLogs**: options
                \`${prefix}options modlogs options\`

                **Global**: off
                \`${prefix}options global off\`
                **Global**: on
                \`${prefix}options global on #channel\`
            `)
            .setColor(randomColor)
        const embed2 = new EmbedBuilder()
            .setDescription(`
                **Blacklist**: add
                \`${prefix}options blacklist add fuck\`
                **Blacklist**: remove
                \`${prefix}options blacklist remove fuck\`
                **Blacklist**: display
                \`${prefix}options blacklist display\`

                **Goodbye**: set subtitle
                \`${prefix}options goodbye set subtitle You won't be missed!\`
                **Goodbye**: set title
                \`${prefix}options goodbye set title Goodbye,\`
                **Goodbye**: show
                \`${prefix}options goodbye show\`
                **Goodbye**: set dark
                \`${prefix}options goodbye set dark #channel\`
                **Goodbye**: set sakura
                \`${prefix}options goodbye set sakura #channel\`
                **Goodbye**: set blue
                \`${prefix}options goodbye set blue #channel\`
                **Goodbye**: set bamboo
                \`${prefix}options goodbye set bamboo #channel\`
                **Goodbye**: set desert
                \`${prefix}options goodbye set desert #channel\`
                **Goodbye**: set code
                \`${prefix}options goodbye set code #channel\`
                **Goodbye**: remove
                \`${prefix}options goodbye remove\`

                **Welcome**: set popcat
                \`${prefix}options welcome set popcat #channel\`
                **Welcome**: set discord-welcome-card
                \`${prefix}options welcome set discord-welcome-card dark true true true #channel\`
                **Welcome**: set discord-welcome-card (SCHEMA)
                \`${prefix}options welcome set discord-welcome-card theme blur rounded border #channel\`
                **Welcome**: set swiftcord default
                \`${prefix}options welcome set swiftcord default #channel\`
                **Welcome**: set swiftcord url
                \`${prefix}options welcome set swiftcord https://upload.serversmp.xyz/prince/ocHlRwuhEI.png #channel\`
                **Welcome**: set discord-welcomer (SCHEMA)
                \`${prefix}options welcome set discord-welcomer [ url or default or invisible ] #channel\`
                **Welcome**: set text
                \`${prefix}options welcome set text #channel\`
                **Welcome**: remove
                \`${prefix}options welcome remove\`

                **CMD**: enable
                \`${prefix}options cmd enable skip\`
                **CMD**: disable
                \`${prefix}options cmd disable skip\`

                **Autorole**: on
                \`${prefix}options autorole on @role\`
                **Autorole**: off
                \`${prefix}options autorole off\`

                **LogData**: on
                \`${prefix}options logdata on\`
                **LogData**: off
                \`${prefix}options logdata off\`
                **LogData**: get web
                \`${prefix}options logdata get web\`
                **LogData**: get msg
                \`${prefix}options logdata get msg\`

                **NQN**: on
                \`${prefix}options nqn on\`
                **NQN**: off
                \`${prefix}options nqn off\`
            `)
            .setColor(randomColor)
        const embed3 = new EmbedBuilder()
            .setDescription(`
                **Auto-publish**: on
                \`${prefix}options auto-publish on\`
                **Auto-publish**: off
                \`${prefix}options auto-publish off\`

                **Advanced-poll**: on
                \`${prefix}options advanced-poll on #channel\`
                **Advanced-poll**: add
                \`${prefix}options advanced-poll add #channel\`
                **Advanced-poll**: rmv
                \`${prefix}options advanced-poll rmv #channel\`
                **Advanced-poll**: off
                \`${prefix}options advanced-poll off\`

                **Anti-alt**: on (punishment type) (send msg to user)
                \`${prefix}options anti-alt on (ban or kick) (true or false)\`
                **Anti-alt**: off
                \`${prefix}options anti-alt off\`

                **Boost**: on
                \`${prefix}options boost on #channel\`
                **Boost**: off
                \`${prefix}options boost off\`

                **Auto-translate**: on
                \`${prefix}options auto-translate on\`
                **Auto-translate**: off
                \`${prefix}options auto-translate off\`
                **Auto-translate**: set percent
                \`${prefix}options auto-translate set percent 80\`
            `)
            .setColor(randomColor)

        return buttonPagination(message, [embed, embed2, embed3]);
    }
}