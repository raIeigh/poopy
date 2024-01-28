module.exports = {
    name: ['poopymode', 'hivemindmode'],
    args: [],
    execute: async function (msg) {
      let poopy = this
      let config = poopy.config
      let data = poopy.data
  
      if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
        data.guildData[msg.guild.id]['poopymode'] = !data.guildData[msg.guild.id]['poopymode']
        if (data.guildData[msg.guild.id]['poopymode']) {
            if (!msg.nosend) await msg.reply('Using the power of **all poopies in the hivemind** now.').catch(() => { })
            return 'Using the power of **all poopies in the hivemind** now.'
        } else {
            if (!msg.nosend) await msg.reply('Using the power of **only one poopy in the hivemind** now.').catch(() => { })
            return 'Using the power of **only one poopy in the hivemind** now.'
        }
      } else {
        await msg.reply('You need to be a moderator to execute that!').catch(() => { })
        return;
      };
    },
    help: {
      name: '<:newpoopy:839191885310066729> poopymode/hivemindmode (moderator only)',
      value: "Toggle between having just 1 bot respond to your messages or all of the ones available."
    },
    cooldown: 5000,
    perms: ['Administrator'],
    type: 'Settings'
  }