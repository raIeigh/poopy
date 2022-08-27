module.exports = {
  name: ['randomname'],
  args: [],
  execute: async function (msg) {
    let poopy = this
    let json = poopy.json

    var nameJSON = json.nameJSON
    var surnames = nameJSON.surname
    var names = nameJSON.male.concat(nameJSON.female)
    await msg.reply(`${names[Math.floor(Math.random() * names.length)].name.value} ${surnames[Math.floor(Math.random() * surnames.length)].name.value}`).catch(() => { })
  },
  help: { name: 'randomname', value: 'Generates a random name.' },
  cooldown: 2500,
  type: 'Random'
}