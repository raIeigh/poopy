module.exports = {
    desc: 'Returns a random location.', func: function () {
        let poopy = this

        var locations = ['home', 'bedroom', 'car', 'bus', 'garden', 'museum', 'hotel', 'festival', 'fair', 'park', 'kitchen', 'toilet', 'farm', 'cinema', 'restaurant', 'school', 'plane', 'train', 'store', 'shopping', 'elevator', 'forest', 'swamp', 'mountain', 'desert', 'island', 'heaven', 'hell', 'iceberg', 'ocean', 'island', 'city', 'airplane', 'boat', 'beach', 'road', 'helicopter', 'aquarium', 'cavern', 'abyss', 'void', 'sky', 'grasslands', 'yard', 'river', 'hill', 'bay', 'tundra', 'plains', 'underdark', 'jungle', 'savanna', 'taiga', 'sea', 'volcano', 'badlands']
        return locations[Math.floor(Math.random() * locations.length)]
    }
}