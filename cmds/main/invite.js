module.exports = {
  name: ['invite'],
  execute: async function (msg) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    if (process.env.BOTWEBSITE) {
        await msg.channel.send(`Bot invite link: <${process.env.BOTWEBSITE}/invite>\nDiscord server link: <${process.env.BOTWEBSITE}/discord>`).catch(() => { })
    } else {
        await msg.channel.send(`Bot invite link: <https://discord.com/oauth2/authorize?client_id=${poopy.bot.user.id}&scope=bot%20applications.commands&permissions=275415166152>`).catch(() => { })
    }
  },
  help: {
    name: 'invite',
    value: "Sends Poopy's invite and Discord server links."
  },
  cooldown: 2500,
  type: 'Main'
}