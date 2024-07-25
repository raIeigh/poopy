module.exports = {
    desc: 'Returns a random name.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var nameJSON = json.nameJSON
        var surnames = nameJSON.surname
        var names = nameJSON.male.concat(nameJSON.female)
        return `${names[Math.floor(Math.random() * names.length)].name.value} ${surnames[Math.floor(Math.random() * surnames.length)].name.value}`
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var nameJSON = json.nameJSON
        var names = nameJSON.male.concat(nameJSON.female).concat(nameJSON.surname)
        return names.map(n => n.name.value)
    },
}