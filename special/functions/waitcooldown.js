module.exports = {
  helpf: '()',
  desc: 'Waits your current cooldown value.',
  func: async (_, msg) => {
    let poopy = this

    var cooldown = (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || 0) - Date.now()
    await poopy.functions.sleep(cooldown)
    return ''
  }
}