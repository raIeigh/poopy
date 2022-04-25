module.exports = {
  name: ['heyapple'],
  execute: async function (msg) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    var attachment = new poopy.modules.Discord.MessageAttachment('templates/heyapple.mp4')
    msg.channel.send({
      files: [attachment]
    }).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: { name: 'heyapple', value: 'Try and hit me if you’re able.' },
  cooldown: 2500,
  type: 'OG'
}