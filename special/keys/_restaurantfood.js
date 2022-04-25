module.exports = {
  desc: 'Returns a random food from a restaurant.',
  func: async function () {
    let poopy = this

    var restaurantJSON = poopy.json.restaurantJSON
    var restaurant = restaurantJSON[Math.floor(Math.random() * restaurantJSON.length)]
    return restaurant.foodItems[Math.floor(Math.random() * restaurant.foodItems.length)].foodName
  }
}