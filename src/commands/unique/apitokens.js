module.exports = {
    name: ['apitokens', 'managetokens'],
    args: [{
        "name": "option",
        "required": true,
        "specifarg": false,
        "orig": "<option>"
    }],
    subcommands: [{
        "name": "help",
        "args": [],
        "description": "Get a list of tokens you can manage, and how to get them."
    },
    {
        "name": "list",
        "args": [{
            "name": "show",
            "required": false,
            "specifarg": true,
            "orig": "[-show]"
        }],
        "description": "Show a list of all your tokens."
    },
    {
        "name": "add",
        "args": [{
            "name": "token",
            "required": true,
            "specifarg": false,
            "orig": "<token>",
            "autocomplete": [
                'AI21_KEY',
                'DALLE2_SESSION',
                //'DEEPAI_KEY',
                //'GOOGLE_KEY',
                'RANDOMSTUFF_KEY',
                'RAPIDAPI_KEY',
                'REMOVEBG_KEY'
            ]
        },
        {
            "name": "value",
            "required": true,
            "specifarg": false,
            "orig": "<value>"
        }],
        "description": "Add a new token value to your tokens, multiple can be used."
    },
    {
        "name": "reset",
        "args": [{
            "name": "token",
            "required": true,
            "specifarg": false,
            "orig": "<token>",
            "autocomplete": [
                'AI21_KEY',
                'DALLE2_SESSION',
                //'DEEPAI_KEY',
                //'GOOGLE_KEY',
                'RANDOMSTUFF_KEY',
                'RAPIDAPI_KEY',
                'REMOVEBG_KEY'
            ]
        }],
        "description": "Removes all of the token's values and resets to the bot's defaults."
    }],
    execute: async function (msg, args) {
        let poopy = this
        let data = poopy.data
        let bot = poopy.bot
        let config = poopy.config
        let commands = poopy.commands
        let { CryptoJS } = poopy.modules
        let { decrypt } = poopy.functions

        let tokenList = {
            AI21_KEY: {
                uses: "`generatetext`",
                method: 'Create an AI21 Studio account (https://studio.ai21.com/sign-up), then go to your account (https://studio.ai21.com/account/account) and copy the API key',
                example: '4QRVuB48Djt1ckJa8TQcAMRPEY8hL7V3'
            },
            DALLE2_SESSION: {
                uses: "`dalle2text`, `dalle2variations`",
                method: "If you have access, go to the website (https://labs.openai.com/) and inspect element (F12). Click the Network tab, do a random generation, click the list item with the name \"tasks\", then click the Headers tab at the right menu and scroll down, you'll find the Bearer authorization and copy it (don't include \"Bearer\"). This session token is temporary so it",
                example: 'sess-770lhwAbGJP0VQcmbJ3f7p8XlVII6zXkeciNrwfK'
            },
            /*DEEPAI_KEY: {
                uses: "`waifu2x`, `superresolution`, `weirdcore`, `generatetext`?",
                method: 'Create a DeepAI account (https://deepai.org), then go to your profile (https://deepai.org/dashboard/profile) and copy the api-key',
                example: '758271bd-f608-4c9e-9e39-8b69852ae78c'
            },
            GOOGLE_KEY: {
                uses: "`youtube`",
                method: "Go to Google Cloud console (https://console.cloud.google.com/welcome), then click the top left button and click \"NEW PROJECT\" (if you haven't created one yet). Activate the YouTube Data API (https://console.cloud.google.com/apis/library/youtube.googleapis.com) and create an API key for it (https://console.cloud.google.com/apis/credentials)",
                example: 'AIzaSyKxWTcB1l0rAHL62eP96pfnQJ5bBCtkW_r'
            },*/
            RANDOMSTUFF_KEY: {
                uses: '`cleverbot`?',
                method: 'Make an account at https://api-info.pgamerx.com/, manage your keys (https://api-info.pgamerx.com/manage-key), generate a new one and copy it',
                example: '98ZrLnaah7i9'
            },
            RAPIDAPI_KEY: {
                uses: '`ocr`, `translate`, `badtranslate`, `bing`, `speechtotext`, `cleverbot`?',
                method: "Create a RapidAPI account (https://rapidapi.com/auth/register) and go to your apps (https://rapidapi.com/developer/dashboard). Click the default-application then click Settings, show the Application Key and copy it. For this to fully work, you'll also need to subscribe to the APIs: Microsoft Computer Vision, Microsoft Translator Text, Bing Web Search, Speech Recognition English and random-stuff-api",
                example: '1b4rhcq2gblihxyjxdskzpnvh0ttgv1uyli3lihvxjslts2jta'
            },
            REMOVEBG_KEY: {
                uses: '`removebg`',
                method: 'Make a Kaleido account (https://accounts.kaleido.ai/users/sign_in), go to your dashboard and click the API keys tab (https://www.remove.bg/dashboard#api-key). Click to create a new API key and then copy it',
                example: 'SjcTC3wvNapVN571Eu8hpA14'
            }
        }

        var options = {
            help: async (msg) => {
                var dmChannel = await msg.author.createDM().catch(() => { })

                if (dmChannel) {
                    if (config.textEmbeds) await dmChannel.send(`Here, you can manage your own keys and tokens to freely access APIs without having to deal with the bot's quotas and limits! Multiple tokens can be used for each API, they're encrypted when saved.\n\n${Object.keys(tokenList).map(token => {
                        var tokenInfo = tokenList[token]

                        return `\`${token}\`\n> **Used in:** ${tokenInfo.uses}\n> **Method:** ${tokenInfo.method}\n> **Example Token:** ${tokenInfo.example}`
                    }).join('\n\n')}`.substring(0, 2000)).catch(async () => {
                        await msg.reply('Couldn\'t send info to you. Do you have me blocked?').catch(() => { })
                        return
                    })
                    else await dmChannel.send({
                        embeds: [{
                            "title": 'API Tokens',
                            "description": "Here, you can manage your own keys and tokens to freely access APIs without having to deal with the bot's quotas and limits! Multiple tokens can be used for each API, they're encrypted when saved.",
                            "color": 0x472604,
                            "footer": {
                                icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                text: bot.user.username
                            },
                            "fields": Object.keys(tokenList).map(token => {
                                var tokenInfo = tokenList[token]

                                return {
                                    name: `\`${token}\``,
                                    value: `**Used in:** ${tokenInfo.uses}\n**Method:** ${tokenInfo.method}\n**Example Token:** ${tokenInfo.example}`
                                }
                            })
                        }]
                    }).catch(async () => {
                        await msg.reply('Couldn\'t send info to you. Do you have me blocked?').catch(() => { })
                        return
                    })
                } else await msg.reply('Couldn\'t send help to you. Do you have me blocked?').catch(() => { })
            },

            list: async (msg) => {
                if (config.textEmbeds) await msg.reply(Object.keys(tokenList).map(token => {
                    var tokens = data['user-data'][msg.author.id]['tokens'][token] ?? []

                    return `\`${token}\` -> ${tokens.length > 0 ? tokens.map(t => decrypt(t, !args.indexOf('-show'))).join(', ') : 'None.'}`
                }).join('\n').substring(0, 2000)).catch(() => { })
                else await msg.reply({
                    embeds: [{
                        "title": 'Token Manager',
                        "description": Object.keys(tokenList).map(token => {
                            var tokens = data['user-data'][msg.author.id]['tokens'][token] ?? []
        
                            return `\`${token}\` -> ${tokens.length > 0 ? tokens.map(t => decrypt(t, !args.indexOf('-show'))).join(', ') : 'None.'}`
                        }).join('\n'),
                        "color": 0x472604,
                        "footer": {
                            icon_url: bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                            text: bot.user.username
                        }
                    }]
                }).catch(() => { })
            },

            add: async (msg, args) => {
                var token = args[1]
                var value = args[2]

                if (!token) {
                    await msg.reply("What's the token name?!")
                    return
                }

                if (!value) {
                    await msg.reply("What's the token value?!").catch(() => { })
                    return
                }

                var tokenData = tokenList[token]
                
                if (!tokenData) {
                    await msg.reply("Invalid token name.").catch(() => { })
                    return
                }

                var tokenRegex = new RegExp(`^[a-zA-Z0-9_-]{${tokenData.example.length}}$`)

                if (!value.match(tokenRegex)) {
                    await msg.reply("Invalid token value.").catch(() => { })
                    return
                }

                var encrypted = CryptoJS.AES.encrypt(value, process.env.AUTH_TOKEN)

                var tokens = data['user-data'][msg.author.id]['tokens']

                tokens[token] = tokens[token] ?? []
                tokens[token].push(encrypted)

                await msg.reply(`✅ \`${token}\` added.`).catch(() => { })
            },

            reset: async (msg, args) => {
                var token = args[1]

                if (!token) {
                    await msg.reply("What's the token name?!")
                    return
                }

                var tokenData = tokenList[token]
                
                if (!tokenData) {
                    await msg.reply("Invalid token name.").catch(() => { })
                    return
                }

                delete data['user-data'][msg.author.id]['tokens'][token]

                await msg.reply(`✅ \`${token}\` has been reset.`).catch(() => { })
            }
        }

        if (!args[1]) {
            if (config.textEmbeds) msg.reply({
                content: "**help** - Get a list of tokens you can manage, and how to get them.\n**list** [-show] - Show a list of all your tokens.\n**add** <token> <value> - **DON'T USE THIS IN A PUBLIC SERVER!** Add a new token value to your tokens, multiple can be used.\n**reset** <token> - Removes all of the token's values and resets to the bot's defaults.",
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            else msg.reply({
                embeds: [{
                    "title": "Available Options",
                    "description": "**help** - Get a list of tokens you can manage, and how to get them.\n**list** [-show] - Show a list of all your tokens.\n**add** <token> <value> - **DON'T USE THIS IN A PUBLIC SERVER!** Add a new token value to your tokens, multiple can be used.\n**reset** <token> - Removes all of the token's values and resets to the bot's defaults.",
                    "color": 0x472604,
                    "footer": {
                        "icon_url": bot.user.displayAvatarURL({
                            dynamic: true, size: 1024, format: 'png'
                        }),
                        "text": bot.user.username
                    },
                }]
            }).catch(() => { })
            return
        }

        if (!options[args[1].toLowerCase()]) {
            await msg.reply('Not a valid option.')
            return
        }

        await options[args[1].toLowerCase()](msg, args.slice(1))
    },
    help: {
        name: 'apitokens/managetokens <option>',
        value: "**ONLY USE THIS COMMAND IN PRIVATE SERVERS!** Manage tokens for different APIs, like remove.bg, YouTube, OCR, and many others. Use the command alone for more info."
    },
    cooldown: 5000,
    type: 'Unique'
}