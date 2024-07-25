module.exports = {
  name: ['randomname'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json

    var nameJSON = json.nameJSON
    var surnames = nameJSON.surname
    var names = nameJSON.male.concat(nameJSON.female)
    var name = `${names[Math.floor(Math.random() * names.length)].name.value} ${surnames[Math.floor(Math.random() * surnames.length)].name.value}`
    if (!msg.nosend) await msg.reply(name).catch(() => { })
    return name
  },
  help: { name: 'randomname', value: 'Generates a random name.' },
  cooldown: 2500,
  type: 'Random'
}