const { SlashCommandBuilder } = require('@discordjs/builders');

const commandObject = {
    info: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Poopy says the message in the command.')

        .addStringOption(option =>
            option.setName('content')
                .setDescription('The message\'s content.')
                .setRequired(true))

        .addUserOption(option =>
            option.setName('user')
                .setDescription('An user to DM the content.')
                .setRequired(false))

        .addIntegerOption(option =>
            option.setName('repeat')
                .setDescription('How much times to repeat. (max 25)')
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(false))

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
        const dmUser = options.getUser('user');
        const repeat = options.getInteger('repeat');

        const channelToSend = dmUser ?? channel;

        if (repeat && !(permissions.has('ADMINISTRATOR') || ermissions.has('MANAGE_MESSAGES') || user.id == guild.ownerId)) {
            await interaction.reply('Fat').catch(() => { });
            return
        }

        await interaction.deferReply().catch(() => { });
        await interaction.deleteReply().catch(() => { });

        for (let i = 1; i <= (repeat ?? 1); i++)
            await channelToSend.send({
                content: content,
                allowedMentions: {
                    parse: (permissions.has('ADMINISTRATOR') ||
                        permissions.has('MENTION_EVERYONE') ||
                        user.id == guild.ownerId) ?
                        ['users', 'everyone', 'roles'] : ['users']
                }
            }).catch(() => { });
    },

    cooldown: 2500,

    type: 'Main'
};

module.exports = commandObject;