module.exports = {
  name: ['invite'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let bot = poopy.bot

    await msg.channel.sendTyping().catch(() => { })
    if (process.env.BOT_WEBSITE) {
        await msg.reply(`Bot invite link: <${process.env.BOT_WEBSITE}/invite>\nDiscord server link: <${process.env.BOT_WEBSITE}/discord>`).catch(() => { })
    } else {
        await msg.reply(`Bot invite link: <https://discord.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot%20applications.commands&permissions=275415166152>`).catch(() => { })
    }
  },
  help: {
    name: 'invite',
    value: "Sends Poopy's invite and Discord server links."
  },
  cooldown: 2500,
  type: 'Main'
}