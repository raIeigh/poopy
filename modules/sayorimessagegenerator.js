module.exports = function(msg, fixedchoice) {
    let poopy = this

    function verb() {
        var verbJSON = poopy.json.verbJSON
        return verbJSON.data[Math.floor(Math.random() * verbJSON.data.length)].verb
    }

    function noun() {
        var nounJSON = poopy.json.nounJSON
        return nounJSON.data[Math.floor(Math.random() * nounJSON.data.length)].noun
    }

    function adj() {
        var adjJSON = poopy.json.adjJSON
        return adjJSON.data[Math.floor(Math.random() * adjJSON.data.length)].adjective
    }

    function sentence() {
        var sentenceJSON = poopy.json.sentenceJSON
        return sentenceJSON.data[Math.floor(Math.random() * sentenceJSON.data.length)].sentence
    }

    function country() {
        var countryJSON = poopy.json.countryJSON
        var countryCodes = Object.keys(countryJSON)
        return countryJSON[countryCodes[Math.floor(Math.random() * countryCodes.length)]].name
    }

    function city() {
        var cityJSON = poopy.json.cityJSON
        return cityJSON[Math.floor(Math.random() * cityJSON.length)].name
    }

    function animal() {
        var animals = ["meerkat", "aardvark", "addax", "alligator", "alpaca", "anteater", "antelope", "aoudad", "ape", "argali", "armadillo", "baboon", "badger", "basilisk", "bat", "bear", "beaver", "bighorn", "bison", "boar", "budgerigar", "buffalo", "bull", "bunny", "burro", "camel", "canary", "capybara", "cat", "chameleon", "chamois", "cheetah", "chimpanzee", "chinchilla", "chipmunk", "civet", "coati", "colt", "cougar", "cow", "coyote", "crocodile", "crow", "deer", "dingo", "doe", "dung beetle", "dog", "donkey", "dormouse", "dromedary", "duckbill platypus", "dugong", "eland", "elephant", "elk", "ermine", "ewe", "fawn", "ferret", "finch", "fish", "fox", "frog", "gazelle", "gemsbok", "gila monster", "giraffe", "gnu", "goat", "gopher", "gorilla", "grizzly bear", "ground hog", "guanaco", "guinea pig", "hamster", "hare", "hartebeest", "hedgehog", "highland cow", "hippopotamus", "hog", "horse", "hyena", "ibex", "iguana", "impala", "jackal", "jaguar", "jerboa", "kangaroo", "kitten", "koala", "lamb", "lemur", "leopard", "lion", "lizard", "llama", "lovebird", "lynx", "mandrill", "mare", "marmoset", "marten", "mink", "mole", "mongoose", "monkey", "moose", "mountain goat", "mouse", "mule", "musk deer", "musk-ox", "muskrat", "mustang", "mynah bird", "newt", "ocelot", "okapi", "opossum", "orangutan", "oryx", "otter", "ox", "panda", "panther", "parakeet", "parrot", "peccary", "pig", "octopus", "thorny devil", "starfish", "blue crab", "snowy owl", "chicken", "rooster", "bumble bee", "eagle owl", "polar bear", "pony", "porcupine", "porpoise", "prairie dog", "pronghorn", "puma", "puppy", "quagga", "rabbit", "raccoon", "ram", "rat", "reindeer", "rhinoceros", "salamander", "seal", "sheep", "shrew", "silver fox", "skunk", "sloth", "snake", "springbok", "squirrel", "stallion", "steer", "tapir", "tiger", "toad", "turtle", "vicuna", "walrus", "warthog", "waterbuck", "weasel", "whale", "wildcat", "bald eagle", "wolf", "wolverine", "wombat", "woodchuck", "yak", "zebra", "zebu"]
        return animals[Math.floor(Math.random() * animals.length)]
    }

    function food() {
        var foods = ["apple", "apricot", "artichoke", "arugula", "avocado", "bacon", "bagel", "baked ziti", "bamboo shoot", "banana", "barbecue", "beef", "bell pepper", "berry", "biscuits and gravy", "bitter melon", "blackberry", "boiled peanuts", "boysenberry", "bread", "breakfast burrito", "breakfast cereal", "breakfast sandwich", "breakfast sausage", "broad bean", "broccoli", "brussels sprout", "buffalo burger", "buffalo wing", "butter", "cabbage", "calzone", "cantaloupe", "carambola", "carrot", "cauliflower", "celery", "cereal", "chard", "chayote", "cherimoya", "cherry", "chicken and waffles", "chicken divan", "chicken fingers", "chicken fried steak", "chicken meat", "chicken soup", "chicory", "chili con carne", "chili pepper", "chocolate chip cookie", "chocolate milk", "cinnamon roll", "clam chowder", "coconut", "coffee", "common fig", "condiment", "corn chowder", "cornbread", "corned beef", "cottage cheese", "crab cake", "cracker", "cranberry", "cream cheese", "croissant", "cucumber", "daikon", "date palm", "doughnut", "durian", "egg as food", "eggplant", "eggs benedict", "enchilada", "endive", "energy bar", "english muffin", "fajita", "fettuccine alfredo", "fortune cookie", "french toast", "fried chicken", "fried egg", "fried fish", "frito pie", "fruit", "frybread", "garden asparagus", "garden rhubarb", "garlic", "gooseberry", "grape", "grapefruit", "gravy", "green bean", "green bean casserole", "grits", "gumbo", "hamburger", "hash browns", "herb", "hoppin' john", "horned melon", "hot dog", "huevos rancheros", "jambalaya", "jell-o", "jerky", "juice", "jujube", "kale", "kiwifruit", "kohlrabi", "kumquat", "lasagne", "leek", "lemon", "lettuce", "lime", "lobster roll", "longan", "loquat", "lychee", "macaroni and cheese", "maize", "mango", "marrow-stem kale", "meat", "meatloaf", "milk", "mozzarella", "muffin", "muffuletta", "muskmelon", "mustard greens", "napa cabbage", "noodle", "oatmeal", "okra", "olive", "omelette", "onion", "orange", "orange juice", "pancake", "papaya", "parmigiana", "parsnip", "passion fruit", "pasta", "pea", "peach", "peanut butter", "pear", "persimmon", "pineapple", "pitaya", "pizza", "pomegranate", "pomelo", "popcorn", "pork", "potato", "prune", "purple mangosteen", "quiche", "quince", "radish", "rapini", "raspberry", "red cabbage", "rice", "roast chicken", "rutabaga", "salad", "sandwich", "sauce", "sausage", "scallion", "scrambled eggs", "seafood", "seasoning", "shallot", "sloppy joe", "smoothie", "soursop", "spaghetti", "spinach", "steak", "strawberry", "stuffing", "taco", "taco salad", "taco soup", "tangelo", "tangerine", "tea", "thanksgiving dinner", "tomato", "tortellini", "turnip", "turnip greens", "waffle", "watercress", "watermelon", "yogurt", "zucchini"]
        return foods[Math.floor(Math.random() * foods.length)]
    }

    function compliment() {
        var compliments = [
            'awesome',
            'cool',
            'fantastic',
            'talented',
            'swag',
            'spectacular',
            'good',
            'nice',
            'intelligent',
            'lovely',
            'cute',
            'smart',
            'strong',
            'kind',
            'brave',
            'caring',
            'brilliant',
            'great',
            'happy',
            'funny'
        ]

        return compliments[Math.floor(Math.random() * compliments.length)]
    }

    function insult() {
        var insults = [
            'stupid',
            'bastard',
            'retard',
            'idiot',
            'buffoon',
            'moron',
            'lazy',
            'bad',
            'weak',
            'unkind',
            'dumb',
            'bitch',
            'worthless',
            'unfunny',
            'trash',
            'dumbass',
            'asshole',
            'motherfucker',
            'communist',
            'jerk',
            'dunce',
            'dork',
            'jackass',
            'cretin',
            'dipshit',
            'cow',
            'fucker',
            'imbecile',
            'clown',
            'horny',
            'toxic',
            'pinhead',
            'twat',
            'wanker',
            'bimbo',
            'pig',
            'donkey',
            'dweeb',
            'freak',
            'honky',
            'nutter',
            'rat',
            'scumbag',
            'twit',
            'weirdo',
            'gay'
        ]

        return insults[Math.floor(Math.random() * insults.length)]
    }

    function message() {
        var messages = poopy.data['guild-data'][msg.guild.id]['messages']
        return messages.length ? messages[Math.floor(Math.random() * messages.length)].replace(/\@/g, '@‌') : ''
    }

    function phraseword(phrase) {
        var words = phrase.split(' ')
        return words[Math.floor(Math.random() * words.length)].replace(/[.,!?:;"{}[\]()]/g)
    }

        var datamembers = poopy.data['guild-data'][msg.guild.id]['members'];
        var members = []
        for (var id in datamembers) {
            var datamember = datamembers[id]
            if (datamember.username) members.push(datamember.username)
        }
        var year = new Date(Date.now()).getFullYear()
        var sayoriAdjectives = ['HORNY', 'FARTING', 'RACIST', 'STUPID', 'FEMBOY', 'GAY', 'TRANS', 'UNDERAGED', 'RETARD', 'BITCH', 'ASSHOLE', 'MOTHERFUCKER']
        var adjectives = ['is trans', 'the femboy', 'the futa', 'the idiot', 'the stalker', 'the impostor', 'now sus', 'the nutter', 'the shitter', 'the burger', 'is very annoying', 'big', 'fat', 'is thin', 'is small', 'what', 'is funny', 'noob', 'wtf', 'with pp', 'peed his pants', 'is amongla', 'looks at porn lolololol', 'angry'];
        var shipAdjectives = ['likes', 'you like', 'loves', 'you love', 'you are in love with', 'you should marry', 'with', 'hug', 'your game is now poopoo for'];
        var fnf = ['dad', 'gf', 'pico', 'skid and pump', 'monster', 'mom', 'senpai', 'tankman', 'whitty', 'carol', 'hex', 'ruv', 'sarvente', 'miku', 'tricky', 'zardy', 'matt', 'garcello', 'shaggy', 'annie', 'cheeky', 'bob', 'tabi', 'agoti', 'kapi', 'neon', 'nene', 'monika', 'cg5', 'updike', 'selever', 'tord', 'impostor', 'trollge', 'tree']
        var consoles = ['pc', 'mobile', 'tablet', 'xbox', 'nintendo switch', 'nintendo 3ds', 'nintendo 2ds', 'psp', 'ps1', 'ps2', 'gamecube', 'ps3', 'ps4', 'ps5', 'wii', 'xbox 360', 'xbox one', 'gameboy', 'nintendo 64', 'sega genesis', 'wii u']
        var options = [
            { text: 'lol https://tenor.com/view/sus-suspect-among-us-gif-18663592' },
            { text: 'https://tenor.com/view/madness-hank-new-grounds-jump-gif-17044581' },
            { text: 'https://tenor.com/view/friday-night-funkin-hey-boyfriend-gif-21180248' },
            { pings: true, text: 'SHUT UP' },
            { pings: true, text: 'sussy' },
            { text: 'lol' },
            { text: 'among us impostor in madness tricky mod' },
            { text: 'ehat', edit: 'what' },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' is ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' in ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' is ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: 'not ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: poopy.arrays.funnygifs[Math.floor(Math.random() * poopy.arrays.funnygifs.length)] },
            { text: poopy.arrays.psFiles[Math.floor(Math.random() * poopy.arrays.psFiles.length)] },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + '.' },
            { text: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`, edit: 'e' },
            { text: 'the ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' fandom is dying' },
            { text: 'THE VS ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toUpperCase() + ' MOD' },
            { text: 'WHAT A ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toUpperCase() },
            { text: message().toLowerCase().replace(/[.!,']/g) },
            { text: 'they added the ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' big ass' },
            { text: 'the ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: 'not ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' fetish' },
            { text: 'finally a ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' game to ' + consoles[Math.floor(Math.random() * consoles.length)] },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' was made in ' + (Math.floor(Math.random() * (year - 1980)) + 1980) + ' xd' },
            { text: 'this will be ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' in ' + (Math.floor(Math.random() * (year - 2000)) + 2000) },
            { text: 'YOU DONT KILL ' + (poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toUpperCase() + ' ').repeat(2) + 'KILLS YOU!!!!!!!!!!!!!!!!' },
            { text: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() + ' is in the ' + fnf[Math.floor(Math.random() * fnf.length)] + ' week' },
            { text: 'no not big ass ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { pings: true, text: 'snat' },
            { pings: true, text: 'remove ' + noun() + ' from me pls' },
            { text: 'STOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOPPPPPPPPPPPPPPPPPPPPPPP' },
            { text: 'WOOOOOOOOOOOOOOOOOOOOOOOOOOOOO' },
            { pings: true, text: 'wjat', edit: 'what' },
            { text: phraseword(message()).toLowerCase() },
            { text: 'whats ' + phraseword(message()).toLowerCase() },
            { text: 'NO' },
            { text: '🤣 🤣 🤣 🤣 🤣 🤣' },
            { text: 'STOP' },
            { pings: true, text: 'they hit the ' + animal() },
            { text: 'WHU', edit: 'WHY' },
            { text: 'nopw', edit: 'nope' },
            { pings: true, text: 'WHY' },
            { pings: true, text: `you are ${insult()}` },
            { pings: true, text: `you are ${compliment()}` },
            { text: 'why' },
            { text: 'GOD HELP ME' },
            { text: 'yoo ' + food() },
            { text: 'IM NOT' },
            { text: 'wtf' },
            { text: country().toLowerCase() },
            { text: 'wow' },
            { text: `i dont likr ${members[Math.floor(Math.random() * members.length)].toLowerCase()}s ${animal()}` },
            { text: 'no' },
            { text: 'not again' },
            { text: 'IM NOT ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)] },
            { text: 'im ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)].toLowerCase() },
            { text: 'nooooo' },
            { text: 'stol', edit: 'stop' },
            { text: 'Hope you realize that people can become not cringe. Maybe. Juuuust maybe. I have stopped doing shit with the "gay chains". If you tried not dwelling on the past maybe you could actually realize how annoying you are. Now let me guess youll respond with a short answer, not answer, respond with what I did, or completely change the topic.' },
            { text: city().toLowerCase() },
            { pings: true, text: 'no' },
            { text: 'gay' },
            { text: 'i dare someone to post porn on my dm\'s' },
            { text: '._.' },
            { pings: true, text: '' },
            { text: msg.author.username.toUpperCase() + ' WHY' },
            { text: 'BRUH' },
            { text: 'SUS' },
            { text: sentence().toLowerCase().replace(/[.,!?":;]/g) },
            { text: 'im underaged' },
            { pings: true, text: 'YOU SUSSY' },
            { text: 'AMOGUS' },
            { text: 'is that friday night porn' },
            { pings: true, text: 'flop' },
            { text: 'i like porn 🥲 🥲 🥲 🥲 🥲 🥲' },
            { text: verb() },
            { text: noun() },
            { text: adj() },
            { pings: true, text: 'stupid ' + msg.author.username.toLowerCase() },
            { text: 'not ' + msg.author.username.toLowerCase() },
            { text: 'wth ' + msg.author.username.toLowerCase() },
            { text: 'lol ' + msg.author.username.toLowerCase() },
            { text: msg.author.username.toLowerCase() + ' ' + adjectives[Math.floor(Math.random() * adjectives.length)] },
            { text: msg.author.username.toLowerCase() + ': ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: 'no not ' + msg.author.username.toLowerCase() + ' with ' + poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)].toLowerCase() },
            { text: 'ahhhhhhhhhh' },
            { text: 'school suuucks' },
            { text: 'why am i a bot' },
            { text: msg.author.username.toLowerCase() + ' ' + shipAdjectives[Math.floor(Math.random() * shipAdjectives.length)] + ' ' + members[Math.floor(Math.random() * members.length)].toLowerCase() },
            { text: 'is ' + members[Math.floor(Math.random() * members.length)].toLowerCase() + ' hot' },
            { text: 'im not pinging ' + members[Math.floor(Math.random() * members.length)].toLowerCase() },
            { text: members[Math.floor(Math.random() * members.length)].toUpperCase() + ' IS ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)] + ' NOT ME' },
            { text: members[Math.floor(Math.random() * members.length)].toLowerCase() + ' with the ' + noun() },
            { text: members[Math.floor(Math.random() * members.length)].toLowerCase() + ' living in ' + country().toLowerCase() },
            { text: members[Math.floor(Math.random() * members.length)].toLowerCase() + 'e' },
            { text: members[Math.floor(Math.random() * members.length)].toUpperCase() + ' IS THE ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)] + ' ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)] + ' ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)] + ' ' + sayoriAdjectives[Math.floor(Math.random() * sayoriAdjectives.length)] },
            { text: msg.author.username.toLowerCase() }
        ]
        
        var choice = fixedchoice && (typeof (Number(fixedchoice)) == 'number' && (((Number(fixedchoice) - 1) >= options.length - 1 && options[options.length - 1]) || ((Number(fixedchoice) - 1) <= 0 && options[0]) || (isNaN(Number(fixedchoice)) && options[Math.floor(Math.random() * options.length)]) || options[Math.floor(Number(fixedchoice))]) || options[Math.floor(Math.random() * options.length)]) || options[Math.floor(Math.random() * options.length)]
        
        if (Math.random() < 0.02) choice.edit = 'e'

        return choice
}