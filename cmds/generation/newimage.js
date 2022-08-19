module.exports = {
  name: ['newimage', 'makeimage'],
  args: [{"name":"width","required":true,"specifarg":false,"orig":"<width (max 2000)>"},{"name":"height","required":true,"specifarg":false,"orig":"<height (max 2000)>"},{"name":"r","required":true,"specifarg":false,"orig":"<r>"},{"name":"g","required":true,"specifarg":false,"orig":"<g>"},{"name":"b","required":true,"specifarg":false,"orig":"<b>"},{"name":"a","required":false,"specifarg":false,"orig":"[a]"}],
  execute: async function (msg, args) {
    let poopy = this

    await msg.channel.sendTyping().catch(() => { })
    if (args.length < 6) {
      await msg.reply('Where are all the required arguments?!').catch(() => { })
      await msg.channel.sendTyping().catch(() => { })
      return;
    }

    var width = isNaN(Number(String(args[1]).replace(/,/g, ''))) ? 500 : Number(String(args[1]).replace(/,/g, '')) <= 1 ? 1 : Number(String(args[1]).replace(/,/g, '')) >= 2000 ? 2000 : Number(String(args[1]).replace(/,/g, '')) || 500
    var height = isNaN(Number(String(args[2]).replace(/,/g, ''))) ? 500 : Number(String(args[2]).replace(/,/g, '')) <= 1 ? 1 : Number(String(args[2]).replace(/,/g, '')) >= 2000 ? 2000 : Number(String(args[2]).replace(/,/g, '')) || 500
    var r = (isNaN(Number(String(args[3]).replace(/,/g, ''))) ? 0 : Number(String(args[3]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[3]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[3]).replace(/,/g, '')) || 0).toString(16).padStart(2, '0')
    var g = (isNaN(Number(String(args[4]).replace(/,/g, ''))) ? 0 : Number(String(args[4]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[4]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[4]).replace(/,/g, '')) || 0).toString(16).padStart(2, '0')
    var b = (isNaN(Number(String(args[5]).replace(/,/g, ''))) ? 0 : Number(String(args[5]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[5]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[5]).replace(/,/g, '')) || 0).toString(16).padStart(2, '0')
    var a = (isNaN(Number(String(args[6]).replace(/,/g, ''))) ? 255 : Number(String(args[6]).replace(/,/g, '')) <= 0 ? 0 : Number(String(args[6]).replace(/,/g, '')) >= 255 ? 255 : Number(String(args[6]).replace(/,/g, '')) ?? 255).toString(16).padStart(2, '0')

    var currentcount = poopy.vars.filecount
    poopy.vars.filecount++
    var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
    poopy.modules.fs.mkdirSync(`${filepath}`)

    await poopy.functions.execPromise(`ffmpeg -f lavfi -i "color=0x${r}${g}${b}${a}:s=${width}x${height},format=rgba" ${filepath}/output.png`)
    return await poopy.functions.sendFile(msg, filepath, `output.png`)
  },
  help: {
    name: 'newimage/makeimage <width (max 2000)> <height (max 2000)> <r> <g> <b> [a]',
    value: 'Creates a new image from the specified dimensions and colors.'
  },
  cooldown: 2500,
  type: 'Generation'
}