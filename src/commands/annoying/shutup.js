module.exports = {
  name: ['shutup'],
  args: [{"name":"duration","required":false,"specifarg":false,"orig":"[duration (max 60)]"}],
  execute: async function (msg, args) {
    let poopy = this
    let config = poopy.config
    let tempdata = poopy.tempdata
    let { sleep, getOption } = poopy.functions

    if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
      if (tempdata[msg.guild.id][msg.channel.id]['shut']) return

      var nosend = getOption(args, 'nosend', { n: 0, splice: true, dft: false })
      var duration = isNaN(Number(args[1])) ? 10 : Number(args[1]) >= 60 ? 60 : Number(args[1]) ?? 10

      if (!nosend) await msg.reply('i shit up').catch(() => { })
      tempdata[msg.guild.id][msg.channel.id]['shut'] = true
      await sleep(duration * 1000)
      tempdata[msg.guild.id][msg.channel.id]['shut'] = false
      if (!nosend) await msg.reply('i came back').catch(() => { })
    } else {
      await msg.reply('You need to be a moderator to execute that!').catch(() => { })
      return
    }
  },
  help: {
    name: 'shutup [duration (max 60)] (moderator only)',
    value: 'he shuts up'
  },
  perms: ['Administrator', 'ManageMessages'],
  type: 'Annoying'
}