module.exports = {
    desc: 'Returns a random name.', func: async () => {
        let poopy = this

        var nameJSON = poopy.json.nameJSON
        var surnames = nameJSON.surname
        var names = nameJSON.male.concat(nameJSON.female)
        return `${names[Math.floor(Math.random() * names.length)].name.value} ${surnames[Math.floor(Math.random() * surnames.length)].name.value}`
    }
}