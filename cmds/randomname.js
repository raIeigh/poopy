module.exports = {
  name: ['randomname'],
  execute: async function (msg) {
    let poopy = this

    var nameJSON = poopy.json.nameJSON
    var surnames = nameJSON.surname
    var names = nameJSON.male.concat(nameJSON.female)
    await msg.channel.send(`${names[Math.floor(Math.random() * names.length)].name.value} ${surnames[Math.floor(Math.random() * surnames.length)].name.value}`).catch(() => { })
  },
  help: { name: 'randomname', value: 'Generates a random name.' },
  cooldown: 2500,
  type: 'Random'
}