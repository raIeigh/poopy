const { SlashCommandBuilder } = require('@discordjs/builders');

const commandObject = {
    info: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Poopy says the message in the command.')

        .addStringOption(option =>
            option.setName('content')
                .setDescription('The message\'s content.')
                .setRequired(true)
        )

        /*.addUserOption(option =>
            option.setName('user')
                .setDescription('An user to DM the content.')
                .setRequired(false)
        )

        .addIntegerOption(option =>
            option.setName('repeat')
                .setDescription('How much times to repeat. (max 25)')
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(false)
        )*/

        .addBooleanOption(option =>
            option.setName('tts')
                .setDescription('Whether to enable TTS in the message or not.')
                .setRequired(false)
        )

        .toJSON(),

    async execute(interaction) {
        const options = interaction.options;

        const member = interaction.member;
        const user = interaction.user;
        const channel = interaction.channel;
        const guild = interaction.guild;
        if (!member || !user || !channel || !guild) return;
        const permissions = member.permissions;

        const content = options.getString('content');
        const dmUser = null//options.getUser('user');
        const repeat = null//options.getInteger('repeat');
        const tts = options.getBoolean('tts') ?? false;

        if (dmUser) {
            if (!poopy.data['user-data'][dmUser.id]) {
                poopy.data['user-data'][dmUser.id] = {}
            }
            if (!poopy.tempdata[dmUser.id]) {
                poopy.tempdata[dmUser.id] = {}
            }
            if (dmUser.id === user.id) {
                dmUser.send({
                    content: (anon ? '' : `${user.tag} from ${msg.guild.name}:\n\n`) + saidMessage,
                    files: attachments
                }).then(async () => {
                    msg.react('✅').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                }).catch(async () => {
                    await msg.channel.send('unblock me').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                })
                return
            }
            if (poopy.data['user-data'][member.id]['dms'] === undefined && !poopy.tempdata[member.id]['dmconsent']) {
                poopy.tempdata[msg.author.id]['dmconsent'] = true

                var pending = await msg.channel.send('Pending response.').catch(() => { })
                var send = await poopy.functions.yesno(member, `${!anon ? msg.author.tag : 'Someone'} is trying to send you a message. Will you consent to any unrelated DMs sent with the \`dm\` command?`, member.id).catch(() => { })

                if (send !== undefined) {
                    poopy.data['user-data'][member.id]['dms'] = send
                    member.send({
                        content: `Unrelated DMs from \`dm\` will **${!send ? 'not ' : ''}be sent** to you now.`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    if (pending) {
                        pending.edit(send ? 'You can send DMs to the user now.' : 'blocked on twitter').catch(() => { })
                    }
                } else {
                    pending.edit('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => { })
                }
            } else {
                if (poopy.data['user-data'][member.id]['dms'] === false) {
                    await msg.channel.send('I don\'t have the permission to send unrelated DMs to this user.').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                }
                member.send({
                    content: (!anon ? `${msg.author.tag} from ${msg.guild.name}:\n\n` : '') + saidMessage,
                    files: attachments
                }).then(async () => {
                    msg.react('✅').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                }).catch(async () => {
                    await msg.channel.send('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                })
            }
        }

        const channelToSend = dmUser ?? channel;

        if (repeat && repeat > 1 && !(permissions.has('ADMINISTRATOR') || permissions.has('MANAGE_MESSAGES') || user.id == guild.ownerId)) {
            await interaction.reply({
                content: 'You need the manage messages permission to send more than 1 message!',
                ephemeral: true
            }).catch(() => { });
            return
        }

        if (tts && !(permissions.has('ADMINISTRATOR') || permissions.has('SEND_TTS_MESSAGES') || user.id == guild.ownerId)) {
            await interaction.reply({
                content: 'You need the send TTS messages permissions to send them!',
                ephemeral: true
            }).catch(() => { });
            return
        }

        await interaction.deferReply({ ephemeral: true }).catch(() => { });

        let error

        for (let i = 1; i <= (repeat ?? 1); i++)
            await channelToSend.send({
                content: content,
                tts: tts,
                allowedMentions: {
                    parse: (permissions.has('ADMINISTRATOR') ||
                        permissions.has('MENTION_EVERYONE') ||
                        user.id == guild.ownerId) ?
                        ['users', 'everyone', 'roles'] : ['users']
                }
            }).catch((e) => error = e.message);

        await interaction.editReply({
            content: error ?? 'Successfully sent.',
            ephemeral: true
        }).catch(() => { });
    },

    cooldown: 2500,

    type: 'Main'
};

module.exports = commandObject;