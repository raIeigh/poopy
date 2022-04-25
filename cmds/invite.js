module.exports = {
  name: ['invite'],
  execute: async function (msg) {
    let poopy = this

    msg.channel.sendTyping().catch(() => { })
    msg.channel.send(`Bot invite link: https://discord.com/oauth2/authorize?client_id=${poopy.bot.user.id}&scope=bot&permissions=275415166152\nOfficial Discord server link: https://discord.gg/R4nEBP5Ymf`).catch(() => { })
    msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'invite',
    value: "Sends Poopy's invite and Discord server links."
  },
  cooldown: 2500,
  type: 'Main'
}