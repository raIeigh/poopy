module.exports = {
  name: ['shutup'],
  args: [{"name":"duration","required":false,"specifarg":false,"orig":"[duration (max 60)]"}],
  execute: async function (msg, args) {
    let poopy = this

    if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
      if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return

      var duration = isNaN(Number(args[1])) ? 10 : Number(args[1]) >= 60 ? 60 : Number(args[1]) ?? 10

      await msg.reply('i shit up').catch(() => { })
      poopy.tempdata[msg.guild.id][msg.channel.id]['shut'] = true
      await poopy.functions.sleep(duration * 1000)
      poopy.tempdata[msg.guild.id][msg.channel.id]['shut'] = false
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
  perms: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
  type: 'Annoying'
}