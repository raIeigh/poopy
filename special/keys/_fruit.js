module.exports = {
    desc: 'Returns a random fruit.', func: async function () {
        let poopy = this

        var fruits = ["apple", "apricot", "avocado", "banana", "berry", "blackberry", "boysenberry", "cantaloupe", "carambola", "cherimoya", "cherry", "coconut", "common fig", "cranberry", "date palm", "durian", "gooseberry", "grape", "grapefruit", "horned melon", "jujube", "kiwifruit", "kumquat", "lemon", "lime", "longan", "loquat", "lychee", "mango", "muskmelon", "olive", "orange", "papaya", "passion fruit", "peach", "pear", "persimmon", "pineapple", "pitaya", "pomegranate", "pomelo", "prune", "purple mangosteen", "quince", "raspberry", "soursop", "strawberry", "tangelo", "tangerine", "watermelon"]
        return fruits[Math.floor(Math.random() * fruits.length)]
    }
}