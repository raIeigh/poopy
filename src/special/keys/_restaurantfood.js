module.exports = {
  desc: 'Returns a random food from a restaurant.',
  func: function () {
    let poopy = this
    let json = poopy.json

    var restaurantJSON = json.restaurantJSON
    var restaurant = restaurantJSON[Math.floor(Math.random() * restaurantJSON.length)]
    return restaurant.foodItems[Math.floor(Math.random() * restaurant.foodItems.length)].foodName
  },
  array: function () {
    let poopy = this
    let json = poopy.json

    var restaurantJSON = json.restaurantJSON
    return restaurantJSON.map(restaurant => restaurant.foodItems.map(food => food.foodName)).flat()
  }
}