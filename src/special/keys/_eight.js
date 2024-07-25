module.exports = {
    desc: 'Returns a random 8-Ball phrase.',
    func: function () {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.eightball[Math.floor(Math.random() * arrays.eightball.length)]
    },
    array: function () {
        let poopy = this
        let arrays = poopy.arrays

        return arrays.eightball
    }
}