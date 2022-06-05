module.exports = {
    desc: 'Returns a random vegetable.', func: function () {
        let poopy = this

        var vegetables = ["artichoke", "arugula", "bamboo shoot", "bell pepper", "bitter melon", "broad bean", "broccoli", "brussels sprout", "cabbage", "carrot", "cauliflower", "celery", "chard", "chayote", "chicory", "chili pepper", "cucumber", "daikon", "eggplant", "endive", "garden asparagus", "garden rhubarb", "garlic", "green bean", "herb", "kale", "kohlrabi", "leek", "lettuce", "maize", "marrow-stem kale", "mustard greens", "napa cabbage", "okra", "onion", "parsnip", "pea", "potato", "radish", "rapini", "red cabbage", "rutabaga", "scallion", "shallot", "spinach", "tomato", "turnip", "turnip greens", "watercress", "zucchini"]
        return vegetables[Math.floor(Math.random() * vegetables.length)]
    }
}