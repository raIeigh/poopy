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
        )*/

        .addIntegerOption(option =>
            option.setName('repeat')
                .setDescription('How much times to repeat. (max 25)')
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(false)
        )

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
        //const dmUser = options.getUser('user');
        const repeat = options.getInteger('repeat');
        const tts = options.getBoolean('tts') ?? false;

        const channelToSend = channel//dmUser ?? channel;

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