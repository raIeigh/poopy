module.exports = {
  name: ['sayorichoice', 'schoice'],
  execute: async function (msg, args) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    var saidMessage = args.join(' ').substring(args[0].length + 1).replace(/’/g, '\'')
    poopy.vars.symbolreplacements.forEach(symbolReplacement => {
      symbolReplacement.target.forEach(target => {
        saidMessage = saidMessage.replace(new RegExp(target, 'ig'), symbolReplacement.replacement)
      })
    })
    var matchedTextes = saidMessage.match(/"([\s\S]*?)"/g)
    if (!matchedTextes) {
      matchedTextes = ['""', '""']
    } else if (!matchedTextes[1]) {
      matchedTextes[1] = '""'
    }
    var bchoice = matchedTextes[0].substring(1, matchedTextes[0].length - 1)
    var rchoice = matchedTextes[1].substring(1, matchedTextes[1].length - 1)
    var currentcount = poopy.vars.filecount
    poopy.vars.filecount++
    var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
    poopy.modules.fs.mkdirSync(`${filepath}`)
    var sayori = await poopy.modules.Jimp.read(`templates/sayori.png`)
    var bangers = await poopy.modules.Jimp.loadFont('templates/fonts/Bangers/Bangers.fnt')
    await sayori.print(bangers, 52, 35, { text: poopy.modules.Discord.Util.cleanContent(bchoice, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 176, 62)
    await sayori.print(bangers, 487, 38, { text: poopy.modules.Discord.Util.cleanContent(rchoice, msg), alignmentX: poopy.modules.Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: poopy.modules.Jimp.VERTICAL_ALIGN_MIDDLE }, 228, 72)
    await sayori.writeAsync(`${filepath}/output.png`)
    await poopy.functions.sendFile(msg, filepath, `output.png`)
  },
  help: {
    name: 'sayorichoice/schoice "{blueChoice}" "{redChoice}"',
    value: 'Creates an image with Sayori where you can choose between 2 options.'
  },
  cooldown: 2500,
  type: 'Inside Joke'
}