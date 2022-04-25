module.exports = {
    desc: 'Returns a random restaurant.', func: async () => {
        let poopy = this

        var restaurantJSON = poopy.json.restaurantJSON
        return restaurantJSON[Math.floor(Math.random() * restaurantJSON.length)].restaurant
    }
}