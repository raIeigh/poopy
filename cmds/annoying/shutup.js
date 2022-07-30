module.exports = {
  name: ['shutup'],
  execute: async function (msg, args) {
    let poopy = this

    if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.permissions.has('MANAGE_MESSAGES') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
      if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return

      var duration = isNaN(Number(args[1])) ? 10 : Number(args[1]) >= 60 ? 60 : Number(args[1]) ?? 10

      await poopy.functions.waitMessageCooldown()
      await msg.channel.send('i shit up').catch(() => { })
      poopy.tempdata[msg.guild.id][msg.channel.id]['shut'] = true
      await poopy.functions.sleep(duration * 1000)
      poopy.tempdata[msg.guild.id][msg.channel.id]['shut'] = false
      await poopy.functions.waitMessageCooldown()
      await msg.channel.send('i came back').catch(() => { })
    } else {
      await poopy.functions.waitMessageCooldown()
      await msg.channel.send('You need to be a moderator to execute that!').catch(() => { })
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