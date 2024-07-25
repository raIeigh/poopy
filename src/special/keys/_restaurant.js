module.exports = {
    desc: 'Returns a random restaurant.',
    func: function () {
        let poopy = this
        let json = poopy.json

        var restaurantJSON = json.restaurantJSON
        return restaurantJSON[Math.floor(Math.random() * restaurantJSON.length)].restaurant
    },
    array: function () {
        let poopy = this
        let json = poopy.json

        var restaurantJSON = json.restaurantJSON
        return restaurantJSON.map(r => r.restaurant)
    }
}