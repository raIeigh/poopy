import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

const commandObject = {
    info: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Poopy says the message in the command.')

        .addStringOption(option =>
            option.setName('content')
                .setDescription('The message\'s content.')
                .setRequired(true)
        )

        .addUserOption(option =>
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
        )

        .toJSON(),

    async execute(interaction: CommandInteraction): Promise<any> {
        const options = interaction.options;

        const member = interaction.member as GuildMember;
        const user = interaction.user;
        const guild = interaction.guild;
        if (!member || !user || !guild) return;
        const permissions = member.permissions;

        const content = options.getString('content');
        const dmUser = options.getUser('user');
        const repeat = options.getInteger('repeat');

        await interaction.reply({
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

export default commandObject;