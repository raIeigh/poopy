module.exports = {
  name: ['shutup'],
  args: [{"name":"duration","required":false,"specifarg":false,"orig":"[duration (max 60)]"}],
  execute: async function (msg, args) {
    let poopy = this
    let config = poopy.config
    let tempdata = poopy.tempdata
    let { sleep } = poopy.functions

    if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
      if (tempdata[msg.guild.id][msg.channel.id]['shut']) return

      var duration = isNaN(Number(args[1])) ? 10 : Number(args[1]) >= 60 ? 60 : Number(args[1]) ?? 10

      await msg.reply('i shit up').catch(() => { })
      tempdata[msg.guild.id][msg.channel.id]['shut'] = true
      await sleep(duration * 1000)
      tempdata[msg.guild.id][msg.channel.id]['shut'] = false
      await msg.reply('i came back').catch(() => { })
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