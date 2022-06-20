module.exports = {
  name: ['invite'],
  execute: async function (msg) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    await msg.channel.send(`Bot invite link: https://poopies-for-you.herokuapp.com/invite\nOfficial Discord server link: https://poopies-for-you.herokuapp.com/discord`).catch(() => { })
    await msg.channel.sendTyping().catch(() => { })
  },
  help: {
    name: 'invite',
    value: "Sends Poopy's invite and Discord server links."
  },
  cooldown: 2500,
  type: 'Main'
}