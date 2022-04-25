module.exports = {
  name: ['canigetadmin'],
  execute: async function (msg) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    var attachment = new poopy.modules.Discord.MessageAttachment('templates/no.mp4')
    msg.channel.send({
      files: [attachment]
    }).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: { name: 'canigetadmin', value: 'Yo can I get admin? 😂' },
  cooldown: 2500,
  type: 'OG'
}