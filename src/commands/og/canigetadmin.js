module.exports = {
  name: ['canigetadmin'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let { Discord } = poopy.modules

    await msg.channel.sendTyping().catch(() => { })
    var attachment = new Discord.MessageAttachment('assets/video/no.mp4')
    await msg.reply({
      files: [attachment]
    }).catch(() => { })
    await msg.channel.sendTyping().catch(() => { })
  },
  help: { name: 'canigetadmin', value: 'Yo can I get admin? 😂' },
  cooldown: 2500,
  type: 'OG'
}