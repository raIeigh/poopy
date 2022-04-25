module.exports = {
  name: ['shutup'],
  execute: async function (msg, args) {
    let poopy = this

    if (msg.member.permissions.has('MANAGE_GUILD') || msg.member.roles.cache.find(role => role.name.match(/dev|admin|owner|creator|founder|staff/ig)) || msg.member.permissions.has('MANAGE_WEBHOOKS') || msg.member.permissions.has('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID || poopy.config.ownerids.find(id => id == msg.author.id)) {
      if (poopy.tempdata[msg.guild.id][msg.channel.id]['shut']) return

      var duration = isNaN(Number(args[1])) ? 10 : Number(args[1]) >= 60 ? 60 : Number(args[1]) ?? 10

      msg.channel.send('i shit up').catch(() => { })
      poopy.tempdata[msg.guild.id][msg.channel.id]['shut'] = true
      await poopy.functions.sleep(duration * 1000)
      poopy.tempdata[msg.guild.id][msg.channel.id]['shut'] = false
      msg.channel.send('i came back').catch(() => { })
    } else {
      msg.channel.send('You need to be an admin to execute that!').catch(() => { })
      return
    }
  },
  help: {
    name: '<:newpoopy:839191885310066729> shutup [duration (max 60)] (admin only)',
    value: 'he shuts up'
  },
  perms: ['ADMINISTRATOR'],
  type: 'Annoying'
}