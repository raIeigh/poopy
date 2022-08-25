const fs = require('fs-extra')
const request = require('request')
const axios = require('axios')
const catbox = require('catbox.moe')
const google = require('googleapis').google

let dataValues = {}

dataValues.functions = {}
dataValues.vars = {}
dataValues.modules = {}

dataValues.modules.fs = fs
dataValues.modules.catbox = catbox
dataValues.modules.axios = axios
dataValues.modules.request = request
dataValues.modules.google = google

dataValues.modules.nodefs = require('fs')
dataValues.modules.archiver = require('archiver')
dataValues.modules.spawn = require('child_process').spawn
dataValues.modules.exec = require('child_process').exec
dataValues.modules.fileType = require('file-type')
dataValues.modules.FormData = require('form-data')
dataValues.modules.cheerio = require('cheerio')
dataValues.modules.xml2json = require('xml2js').parseStringPromise
dataValues.modules.util = require('util')
dataValues.modules.md5 = require('md5')
if (fs.existsSync('node_modules/@jimp/plugin-print'))
fs.rmSync('node_modules/@jimp/plugin-print', {
    force: true, recursive: true
})
if (!fs.existsSync('node_modules/@jimp/plugin-print'))
fs.copySync('modules/plugin-print', 'node_modules/@jimp/plugin-print', {
    recursive: true
})
dataValues.modules.Jimp = require('jimp')
dataValues.modules.whatwg = require('whatwg-url')
dataValues.modules.deepai = require('deepai')
dataValues.modules.noblox = require('noblox.js')
dataValues.modules.youtubedl = require('yt-dlp-exec')
//dataValues.modules.Twitter = require('twitter')
dataValues.modules.gis = require('g-i-s')
dataValues.modules.mathjs = require('mathjs')
dataValues.modules.prettyBytes = require('pretty-bytes')
dataValues.modules.itob = require('istextorbinary')
dataValues.modules.os = require('os')

dataValues.modules.deepai.setApiKey(process.env.DEEPAIKEY)
dataValues.modules.noblox.setCookie(process.env.ROBLOXCOOKIE).catch(() => { })

dataValues.vars.validUrl = /(http|https):\/\/([!#$&-;=?-[\]_a-z~]|%[0-9a-fA-F]{2})+/
dataValues.vars.emojiRegex = require('emoji-regex')()
dataValues.vars.Catbox = new catbox.Catbox()
dataValues.vars.Litterbox = new catbox.Litterbox()
dataValues.vars.youtube = google.youtube({
    version: 'v3',
    auth: process.env.GOOGLEKEY
})
/*dataValues.vars.twitterClient = new Twitter({
    consumer_key: process.env.TWITTERCONSUMERKEY,
    consumer_secret: process.env.TWITTERCONSUMERSECRET,
    access_token_key: process.env.TWITTERACCESSTOKENKEY,
    access_token_secret: process.env.TWITTERACCESSTOKENSECRET
})*/
dataValues.vars.gifFormats = ['gif', 'apng']
dataValues.vars.jimpFormats = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'tiff']
dataValues.vars.processingTools = require('./processingTools')
dataValues.vars.symbolreplacements = [{
    target: ['‘',
        '’',
        '‛',
        '❛',
        '❜'],
    replacement: '\''
},
    {
        target: ['“',
            '”',
            '‟'],
        replacement: '"'
    }]
dataValues.vars.punctuation = ['?', '.', '!', '...']
dataValues.vars.caseModifiers = [
    function (text) {
        return text.toUpperCase()
    },
    function (text) {
        return text.toLowerCase()
    },
    function (text) {
        return text.toUpperCase().substring(0, 1) + text.toLowerCase().substring(1)
    }]

dataValues.functions.getEmojis = require('@jimp/plugin-print/emojis')
dataValues.functions.lingo = require('./lingo')
dataValues.functions.gibberish = require('./gibberish')
dataValues.functions.markov = require('./markov')
dataValues.functions.wackywebm = require('./wackywebm')
dataValues.functions.getAllData = require('./dataGathering').getAllData
dataValues.functions.updateAllData = require('./dataGathering').updateAllData
dataValues.functions.globalData = require('./globalData')
dataValues.functions.brainfuck = require('./brainfuck')
dataValues.functions.tobrainfuck = require('./tobrainfuck')
dataValues.functions.generateSayori = require('./sayorimessagegenerator')
dataValues.functions.braille = require('./braille')
dataValues.functions.averageColor = require('./averageColor')
dataValues.functions.spectrogram = require('./spectrogram')

dataValues.functions.lerp = function (start, end, amt) {
    return (1 - amt) * start + amt * end
}

dataValues.functions.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms ?? 0))
}

dataValues.functions.getPsFiles = async function () {
    return new Promise((resolve, reject) => {
        axios.get('https://raw.githubusercontent.com/raIeigh/ps-media-json/main/psfiles.json').then((res) => {
            try {
                resolve(res.data.data)
            } catch (err) {
                reject(err)
            }
        })
    })
}

dataValues.functions.getPsPasta = async function () {
    return new Promise((resolve, reject) => {
        axios.get('https://raw.githubusercontent.com/raIeigh/ps-media-json/main/pspasta.json').then((res) => {
            try {
                resolve(res.data.data)
            } catch (err) {
                reject(err)
            }
        })
    })
}

dataValues.functions.getFunny = async function () {
    return new Promise((resolve, reject) => {
        axios.get('https://raw.githubusercontent.com/raIeigh/ps-media-json/main/funnygif.json').then((res) => {
            try {
                resolve(res.data.data)
            } catch (err) {
                reject(err)
            }
        })
    })
}

dataValues.functions.request = async function (options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return
            }

            try {
                body = JSON.parse(body)
            } catch (_) {}

            resolve({
                request: options,
                status: response.statusCode,
                statusText: response.statusMessage,
                headers: response.headers,
                url: response.request.href,
                data: body
            })
        })
    })
}

dataValues.functions.requireJSON = function (path) {
    return JSON.parse(fs.readFileSync(path).toString())
}

dataValues.functions.regexClean = function (str) {
    return str.replace(/[\\^$.|?*+()[{]/g, (match) => `\\${match}`)
}

dataValues.functions.unescapeHTML = function (value) {
    return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&#\d+;/g, (match) => {
        return String.fromCharCode(match.substring(2, match.length - 1))
    })
}

dataValues.functions.parMatch = function (string) {
    var lastParenthesesIndex = -1
    var llastParenthesesIndex = -1
    var parindex = 0

    for (var i in string) {
        var char = string[i]

        switch (char) {
            case '(':
                if (parindex <= 0) lastParenthesesIndex = Number(i) // set the index of the last parentheses
                parindex++ // open parentheses found
                break

            case ')':
                if (string[i - 1] !== '\\') {
                    parindex-- // closed parentheses found
                    llastParenthesesIndex = Number(i) + 1
                    if (parindex <= 0) {
                        return string.substring(lastParenthesesIndex, Number(i) + 1)
                    }
                }
                break
        }
    }

    if (llastParenthesesIndex > -1) {
        lastParenthesesIndex++
        return string.substring(lastParenthesesIndex, llastParenthesesIndex)
    }

    return null
}

dataValues.functions.matchLongestKey = function (str, keys) {
    if (keys.length <= 0) return ['']
    var longest = ['']
    var matched = false
    for (var i in keys) {
        var match = str.match(new RegExp(`^${dataValues.functions.regexClean(keys[i])}`))
        if (match && match[0].length >= longest[0].length) {
            matched = true
            longest = match
        }
    }
    return matched && longest
}

dataValues.functions.matchLongestFunc = function (str, funcs) {
    if (funcs.length <= 0) return ['']
    var longest = ['']
    var matched = false
    for (var i in funcs) {
        var match = str.match(new RegExp(`${dataValues.functions.regexClean(funcs[i])}$`))
        if (match && match[0].length >= longest[0].length) {
            matched = true
            longest = match
        }
    }
    return matched && longest
}

dataValues.functions.getIndexOption = function (args, i, {
    dft = undefined, n = 1
} = {}) {
    return args.slice(i, i + n) || dft
}

dataValues.functions.getOption = function (args, name, {
    dft = undefined, n = 1, splice = false, join = true, func = (opt) => opt
} = {}) {
    var optionindex = args.indexOf(`-${name}`)
    if (optionindex > -1) {
        var option = []
        for (var i = 1; i <= n; i++) {
            option.push(func(args[optionindex + i], i))
        }
        if (splice) args.splice(optionindex, n + 1)
        if (join) option = option.join(' ')
        return n == 0 ? true: option
    }
    return dft
}

dataValues.functions.parseNumber = function (str, {
    dft = undefined, min = -Infinity, max = Infinity, round = false
} = {}) {
    if (str === undefined || str === '') return dft
    var number = Number(str)
    return isNaN(number) ? dft: (round ? Math.round(Math.max(Math.min(number, max), min)): Math.max(Math.min(number, max), min)) ?? dft
}

dataValues.functions.parseString = function (str, validList, {
    dft = undefined, lower = false, upper = false
} = {}) {
    if (str == undefined || str === '') return dft
    var query = upper ? str.toUpperCase(): lower ? str.toLowerCase(): str
    return validList.find(q => q == query) || dft
}

dataValues.functions.equalValues = function (arr, val) {
    var count = 0
    arr.forEach(v => v == val && count++)
    return count
}

dataValues.functions.randomChoice = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

dataValues.functions.shuffle = function (array) {
    var currentIndex = array.length,
    randomIndex

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--

        [array[currentIndex],
            array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]]
    }

    return array
}

dataValues.functions.similarity = function (s1, s2) {
    function editDistance(s1, s2) {
        s1 = s1.toLowerCase()
        s2 = s2.toLowerCase()

        var costs = new Array()
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i
            for (var j = 0; j <= s2.length; j++) {
                if (i == 0)
                    costs[j] = j
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1]
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1
                        costs[j - 1] = lastValue
                        lastValue = newValue
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue
        }
        return costs[s2.length]
    }

    var longer = s1
    var shorter = s2
    if (s1.length < s2.length) {
        longer = s2
        shorter = s1
    }
    var longerLength = longer.length
    if (longerLength == 0) {
        return 1.0
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

dataValues.functions.chunkArray = function (myArray, chunk_size) {
    var arrayLength = myArray.length
    var tempArray = []

    for (var index = 0; index < arrayLength; index += chunk_size) {
        var myChunk = myArray.slice(index, index + chunk_size)
        tempArray.push(myChunk)
    }

    return tempArray;
}

dataValues.functions.chunkObject = function (object, chunk_size) {
    var values = Object.values(object)
    var final = []
    var counter = 0
    var portion = {}

    for (var key in object) {
        if (counter !== 0 && counter % chunk_size === 0) {
            final.push(portion)
            portion = {}
        }
        portion[key] = values[counter]
        counter++
    }
    final.push(portion)

    return final
}

dataValues.functions.generateId = function (existing, length = 10) {
    var charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    var id = ''

    for (var i = 0; i < length; i++) {
        id += charset[Math.floor(Math.random() * charset.length)]
    }

    if (existing && existing.includes(id)) return dataValues.functions.generateId(existing, length)

    return id
}

dataValues.functions.replaceAsync = async function (str, regex, asyncFn) {
    var promises = []
    str.replace(regex, (match, ...args) => {
        var promise = asyncFn(match, ...args)
        promises.push(promise)
    })
    var data = await Promise.all(promises)
    return str.replace(regex, () => data.shift())
}

dataValues.functions.findAsync = async function (arr, asyncCallback) {
    var promises = arr.map(asyncCallback)
    var results = await Promise.all(promises)
    var index = results.findIndex(result => result)
    return arr[index]
}

dataValues.functions.findIndexAsync = async function (arr, asyncCallback) {
    var promises = arr.map(asyncCallback)
    var results = await Promise.all(promises)
    var index = results.findIndex(result => result)
    return index
}

dataValues.functions.markovChainGenerator = function (text) {
    var textArr = text.split(' ')
    var markovChain = []
    markovChain.findChain = function (w) {
        return this.find(chain => chain.word === w)
    }
    markovChain.random = function () {
        return this[Math.floor(Math.random() * this.length)]
    }
    for (var i = 0; i < textArr.length; i++) {
        var word = textArr[i]
        if (word) {
            if (!markovChain.findChain(word.toLowerCase())) {
                markovChain.push({
                    word: word.toLowerCase(),
                    forms: [],
                    next: [],
                    repeated: 0
                })
            }
            markovChain.findChain(word.toLowerCase()).forms.push(word)
            markovChain.findChain(word.toLowerCase()).repeated++
            if (textArr[i + 1]) {
                markovChain.findChain(word.toLowerCase()).next.push(textArr[i + 1]);
            }
        }
    }
    markovChain.sort((a, b) => {
        return b.repeated - a.repeated
    })
    return markovChain
}

dataValues.functions.markovMe = function (markovChain, text = '', options = {}) {
    var words = markovChain.map(chain => chain.word)

    if (words.length <= 0) return 'no markov data for guild, arabotto 2020'

    var wordNumber = options.wordNumber
    var nopunctuation = options.nopunctuation
    var keepcase = options.keepcase
    var randlerp = options.randomlerp ?? 0.4

    var result = text ? text.split(' '): []
    var chain = markovChain.random()
    var word = result[result.length - 1] || chain.forms[Math.floor(Math.random() * chain.forms.length)]
    result.splice(result.length - 1)
    var maxrepeat = markovChain[0].repeated
    var randomchance = 0
    for (var i = 0; i < (wordNumber || Math.min(words.length, Math.floor(Math.random() * 20) + 1)); i++) {
        result.push(word);
        if (dataValues.vars.validUrl.test(word) && !wordNumber) break
        var markov = markovChain.findChain(word.toLowerCase())
        var newWord = markov.next[Math.floor(Math.random() * markov.next.length)]
        word = newWord
        randomchance = dataValues.functions.lerp(randomchance, maxrepeat, randlerp)
        if (!word || !markovChain.findChain(word.toLowerCase()) || Math.floor(Math.random() * randomchance) >= maxrepeat * 0.5) {
            randomchance = 0
            chain = markovChain.random()
            word = chain.forms[Math.floor(Math.random() * chain.forms.length)]
        }
    }
    result = result.join(' ')
    if (!dataValues.vars.punctuation.find(p => result.match(new RegExp(`[${p}]$`))) && Math.floor(Math.random() * 5) === 0 && !nopunctuation) {
        result += dataValues.vars.punctuation[Math.floor(Math.random() * dataValues.vars.punctuation.length)]
    }
    if (Math.floor(Math.random() * 5) === 0 && !keepcase) {
        result = dataValues.vars.caseModifiers[Math.floor(Math.random() * dataValues.vars.caseModifiers.length)](result)
    }
    return result
}

dataValues.functions.findpreset = function (args) {
    var presets = [
        'ultrafast',
        'superfast',
        'veryfast',
        'faster',
        'fast',
        'medium',
        'slow',
        'slower',
        'veryslow'
    ]
    var preset = 'ultrafast'
    var presetindex = args.indexOf('-encodingpreset')
    if (presetindex > -1) {
        if (presets.find(preset => preset === args[presetindex + 1].toLowerCase())) {
            preset = args[presetindex + 1]
        }
    }
    return preset
}

dataValues.functions.randomKey = function (name) {
    var i = 1
    var keys = []
    while (process.env[name + (i != 1 ? i: '')]) {
        keys.push(process.env[name + (i != 1 ? i: '')])
        i++
    }
    return keys[Math.floor(Math.random() * keys.length)]
}

dataValues.functions.envsExist = function (envs = []) {
    var exist = true

    envs.forEach(env => {
        if (!process.env[env]) exist = false
    })

    return exist
}

dataValues.statuses = JSON.parse(fs.readFileSync('./assets/json/statuses.json'))
dataValues.json = {
    wordJSON: JSON.parse(fs.readFileSync('./assets/json/words.json')),
    fakeWordJSON: JSON.parse(fs.readFileSync('./assets/json/fakeWords.json')),
    continentJSON: JSON.parse(fs.readFileSync('./assets/json/continents.json')),
    countryJSON: JSON.parse(fs.readFileSync('./assets/json/countries.json')),
    languageJSON: JSON.parse(fs.readFileSync('./assets/json/languages.json')),
    cityJSON: JSON.parse(fs.readFileSync('./assets/json/cities.json')),
    restaurantJSON: JSON.parse(fs.readFileSync('./assets/json/foods.json')),
    sentenceJSON: JSON.parse(fs.readFileSync('./assets/json/sentences.json')),
    nounJSON: JSON.parse(fs.readFileSync('./assets/json/nouns.json')),
    verbJSON: JSON.parse(fs.readFileSync('./assets/json/verbs.json')),
    adjJSON: JSON.parse(fs.readFileSync('./assets/json/adjectives.json')),
    imageJSON: JSON.parse(fs.readFileSync('./assets/json/images.json')),
    nameJSON: JSON.parse(fs.readFileSync('./assets/json/names.json')),
    emojiJSON: []
}
dataValues.arrays = {
    arabDictionary: [
        '4chan', 'the poopening', 'negro', 'feet', 'GIANT COCK', 'orgy',
        'e621', 'cum', 'r34', 'mug', 'Talking Tom', 'Talking Ben', 'Talking Angela',
        'IShowSpeed', 'deepwoken', 'pilgrammed', 'lean', '🤓', 'punapea6', 'dream', 'soup land',
        'phexonia studios', 'idfsgs', 'penis', 'sex', 'hentai', 'area', 'World', 'throat',
        'Mongolian', 'finnish', 'Malagasy', 'Iraqi', 'polish', 'ethiopian', 'canadian',
        'ukrainian', 'iranian', 'irish', 'swedish', 'danish', 'french', 'chips', 'spanish',
        'racist', 'superbrohouse', 'deinx', 'bubbley', 'deinbag', 'another', 'crypyth',
        'tordenask', 'lead', 'wovxzers', 'dootings', 'bartekoklol', 'tuca', 'ballfish', 'kleio',
        'crazy', 'cinna', 'btn', 'tree', 'gritzy', 'ruki', 'henry', 'empsy', 'maks', 'henhen',
        'phex', 'icre8', 'bilon', 'fnepp', 'zekkriel', 'tranzst', 'mance', 'luigistar', 'makos',
        'spellbunny', 'scriptedsand', 'puppet', 'josh', 'spooky', 'catfishhotdog', 'robuk',
        'pl0x7', 'lemoardo', 'dundeed', 'notsam', 'luigiluis', 'trongal', 'mysterymeatwad',
        'carlito', 'azureblob', 'simpremove', 'gobby', 'sayori', 'concern', 'betteruser', 'tix',
        'charleh', 'jlol', 'Featured', 'Vesteria', 'Rogue Lineage', 'madness', 'tricky', 'zardy',
        'madness combat', 'splatoon', 'babis', 'wiki', 'fandom', 'milk', 'carrot', 'vinegar',
        'mushroom', 'stew', 'shroom', 'peashooter', 'eyed', 'pea', 'frank', 'carl', 'oil',
        'sunflower', 'chomper', 'piranha', 'fishes', 'fishe', 'fish', 'salami', 'lid', '≥w≤',
        'furry', 'nya', 'uwu', 'owo', '^w^', 'freedom', 'dick', 'flip', 'bottle', 'pork',
        'demotion', 'promotion', 'Error', 'Scream', 'spoon', 'knife', 'all over', 'african',
        'land', '😂', 'yup', 'pee', 'piss', 'stranger language', 'edition', 'version', 'turtle',
        'language', 'stranger', 'persian', 'people', 'Freddy', 'FNAF', 'giraffe', 'hippopotamus',
        'program', 'coding', 'ocean', 'treasure', 'egg', 'tool', 'lad', 'lad village', 'GPU',
        'CPU', 'lag', 'imposter', 'Among Us', 'sus', 'homework', 'markov', 'moment', 'nervous',
        'shy', 'CHICKEN', 'sosig', 'brogle', 'Dad', 'Grand', 'Windows 95', 'Windows XP',
        'big fat', 'blender', 'group', 'Phexonia', 'venezuelan', 'tf2', 'Bastard', 'obby',
        'david', 'WARIO', 'sandals', 'livestream', 'youtube', 'minimum', 'pickle', 'NSFW',
        'hot', 'RALEIGH', 'PEED FAMILY', 'gif', 'nostalgia critic', 'Britain', 'America',
        'United Kingdom', 'soup', 'United States of America', 'WOMEN', 'wife', 'cat',
        'marselo', 'tech support', 'indian', 'australian', 'japanese', 'Plants vs Zombies',
        'Joe Biden', 'chinese', 'Chinese Republic', 'french fries', 'german', 'SWITZERLAND',
        'denmark', 'Donald Trump', 'portuguese', 'nigerian', 'russian', 'beach', 'alpha',
        'beta', 'theaters', 'Movie', 'Trailer', 'Lego', 'chalk', 'Documentation', 'mcdrive',
        'Boner', 'Big', 'Giant', 'Small', 'Awesome', 'STOLEN', 'no', 'yes', 'car', 'Rigby',
        'Mordecai', 'BENSON', 'park', 'blaster', 'gaster', 'Undertale', 'phil', 'Anvil',
        'halloween', 'pumpkin', 'shut up', 'platinum', 'cheats', 'farms', 'GOLD', 'cake day',
        'pizza slice', 'lasagna', 'quesadilla', 'enchilada', 'Miner\'s Haven', 'berezaa',
        'LEGENDARY', 'Bee Swarm Simulator', 'beta tester', 'member', 'creator', 'family',
        'Empire', 'Warfare', 'upvotes', 'downvotes', 'redditor', 'reddit', 'reddit arguments',
        'twitter', 'twitter arguments', 'amongla', 'virus', 'viruses', 'INSTALL NOW',
        'FL Studio VST', 'Torrent', 'Github', 'the ESSENCE', 'soup satan', 'soup god',
        'quesley', 'empsy', 'illegal', 'legal', 'regal', 'deflorestation', 'DONKEY KONG',
        'piss shit come', 'gay chains', 'Tss crazed', 'ralsei', '👶', '✅', 'PIG', 'cucumber',
        'mark\'s pizzeria', 'dominus pizza', 'pizza hut', 'wendy\'s', 'hat', 'tool',
        'burger king', 'mcdonalds', 'nugget', 'fat', 'WTF', 'ROFL', 'XD', 'LMAO', 'LOL', 'Lad',
        'Piid', 'LOUD', 'griefed', 'Fitmc', '2b2t', 'POPBOB', 'mommy', 'Survival', 'Jeff',
        'Slender', 'Piggy', '🐖', 'artistic', 'Burrito', 'fart channel', '💓', 'Banjo',
        'guitarist', 'guitar', 'chords', 'instruments', 'bingus', 'sussy', 'Big ass',
        'crewmate', 'Imposter', 'choccy milk', 'thwomp', '🐡', 'brain rot', 'your mom', 'baby',
        'baby farting', 'Admin', 'EMOTE GAME', 'Sega', 'Sega Genesis', 'Newgrounds', 'Gamejolt',
        'Steam', 'Epic Games', 'basket', 'update released', 'Soup Land', 'ROCKET',
        'clash of clans', 'clothes', 'lore', 'fart machine', 'mech', 'Angry Birds',
        'Bad Piggies', 'vlog', 'dataValues', 'machine', 'Thanos', 'porn', 'New emote', 'bought',
        'Sun', 'Moon', 'Friday Night Funkin', 'Mod', 'Minecraft', 'Terraria', 'Roblox',
        'Shaders', '2012', '2016', 'peter', 'GTA 6', 'GTA', 'bananas', 'shanky', 'PEED',
        'Hollow Knight', 'Burrito Bison', 'Taco', 'taxes', 'budget', 'dollars', 'british',
        'fluffy', 'brocolli', 'brain', 'SHIT', 'HELL', 'naked', 'babis', 'kingdom', 'HAHAHA',
        'arabic', 'Rocket League', 'Fortnite', 'mrflimflam', 'Flamingo', 'rap', 'bitch',
        'Poop', 'MARIO', 'crAck', 'Harambe', 'hellish', 'crimes', 'cordy', 'Halal', 'HARAM',
        'Chungus', 'president', 'santa', 'idiot', 'WOW', 'SANS', 'FART', 'Garfield', 'POG',
        'DEINX', 'discord', 'Super', 'Market', 'Mark', 'EXPLOSIVE', 'combat', 'oyster',
        'Epico', 'Grammar', 'SUS', 'fresh', 'matilda', 'sonic', 'corpses', 'Egyptian', 'White',
        'BLACK', 'wacky', 'card', 'credit', 'Tycoon', 'tunas', 'Israelite', 'Saudi',
        'brazilian', 'Luigi', 'shawty'
    ],
    tenorDictionary: [
        'mug', 'Talking Tom', 'Talking Ben', 'Talking Angela', 'IShowSpeed',
        'deepwoken', 'pilgrammed', 'lean', '🤓', 'punapea6', 'dream', 'soup land',
        'phexonia studios', 'idfsgs', 'chips', 'racist', 'superbrohouse', 'deinx', 'bubbley',
        'deinbag', 'another', 'crypyth', 'tordenask', 'lead', 'wovxzers', 'dootings',
        'bartekoklol', 'tuca', 'ballfish', 'kleio', 'crazy', 'cinna', 'btn', 'tree', 'gritzy',
        'ruki', 'henry', 'empsy', 'maks', 'henhen', 'phex', 'icre8', 'bilon', 'fnepp',
        'zekkriel', 'tranzst', 'mance', 'luigistar', 'makos', 'spellbunny', 'scriptedsand',
        'puppet', 'josh', 'spooky', 'catfishhotdog', 'robuk', 'pl0x7', 'lemoardo', 'dundeed',
        'notsam', 'luigiluis', 'trongal', 'mysterymeatwad', 'carlito', 'azureblob',
        'simpremove', 'gobby', 'sayori', 'concern', 'betteruser', 'tix', 'charleh', 'jlol',
        'Vesteria', 'Rogue Lineage', 'tricky', 'zardy', 'madness combat', 'splatoon', 'babis',
        'carrot', 'vinegar', 'mushroom', 'stew', 'shroom', 'peashooter', 'frank', 'carl',
        'oil', 'sunflower', 'chomper', 'piranha', 'fishes', 'fishe', 'fish', 'salami', 'furry',
        'uwu', 'owo', 'flip', 'bottle', 'pork', 'demotion', 'promotion', 'Error', 'spoon',
        'knife', 'african', '😂', 'yup', 'turtle', 'persian', 'Freddy', 'FNAF', 'giraffe',
        'hippopotamus', 'coding', 'ocean', 'egg', 'tool', 'lad', 'lad village', 'GPU', 'CPU',
        'lag', 'imposter', 'Among Us', 'sus', 'homework', 'CHICKEN', 'sosig', 'brogle',
        'Windows 95', 'Windows XP', 'blender', 'Phexonia', 'tf2', 'Bastard', 'obby', 'david',
        'WARIO', 'sandals', 'livestream', 'youtube', 'pickle', 'hot', 'RALEIGH', 'PEED FAMILY',
        'gif', 'nostalgia critic', 'Britain', 'America', 'United Kingdom', 'soup',
        'United States of America', 'WOMEN', 'cat', 'marselo', 'tech support', 'indian',
        'japanese', 'Plants vs Zombies', 'Joe Biden', 'chinese', 'Chinese Republic',
        'french fries', 'german', 'SWITZERLAND', 'denmark', 'Donald Trump', 'portuguese',
        'nigerian', 'russian', 'beach', 'Lego', 'Documentation', 'mcdrive', 'no', 'yes',
        'Rigby', 'Mordecai', 'BENSON', 'park', 'phil', 'Anvil', 'halloween', 'pumpkin',
        'shut up', 'platinum', 'cheats', 'GOLD', 'cake day', 'pizza slice', 'lasagna',
        'quesadilla', 'enchilada', 'Miner\'s Haven', 'berezaa', 'LEGENDARY',
        'Bee Swarm Simulator', 'beta tester', 'creator', 'upvotes', 'downvotes', 'redditor',
        'reddit', 'reddit arguments', 'twitter', 'twitter arguments', 'amongla', 'virus',
        'viruses', 'INSTALL NOW', 'Torrent', 'Github', 'the ESSENCE', 'soup satan', 'soup god',
        'quesley', 'empsy', 'regal', 'deflorestation', 'DONKEY KONG', 'gay chains',
        'Tss crazed', 'ralsei', '👶', '✅', 'PIG', 'cucumber', 'mark\'s pizzeria',
        'dominus pizza', 'pizza hut', 'wendy\'s', 'burger king', 'mcdonalds', 'nugget', 'fat',
        'WTF', 'ROFL', 'XD', 'LMAO', 'LOL', 'Lad', 'griefed', 'Fitmc', '2b2t', 'POPBOB',
        'Jeff', 'Slender', 'Piggy', '🐖', 'Burrito', 'fart channel', '💓', 'Banjo',
        'guitarist', 'guitar', 'instruments', 'bingus', 'sussy', 'crewmate', 'Imposter',
        'choccy milk', 'thwomp', '🐡', 'baby', 'Admin', 'EMOTE GAME', 'Sega', 'Sega Genesis',
        'Newgrounds', 'Gamejolt', 'Steam', 'Epic Games', 'basket', 'update released',
        'Soup Land', 'ROCKET', 'clash of clans', 'lore', 'mech', 'Angry Birds', 'Bad Piggies',
        'machine', 'Thanos', 'Sun', 'Moon', 'Friday Night Funkin', 'Mod', 'Minecraft',
        'Terraria', 'Roblox', 'Shaders', '2012', '2016', 'peter', 'GTA 6', 'GTA', 'bananas',
        'Hollow Knight', 'Burrito Bison', 'Taco', 'taxes', 'budget', 'dollars', 'british',
        'brocolli', 'HELL', 'babis', 'kingdom', 'HAHAHA', 'arabic', 'Rocket League',
        'Fortnite', 'mrflimflam', 'Flamingo', 'rap', 'MARIO', 'crimes', 'cordy', 'Halal',
        'HARAM', 'Chungus', 'president', 'santa', 'WOW', 'FART', 'Garfield', 'POG', 'DEINX',
        'discord', 'Market', 'Mark', 'EXPLOSIVE', 'combat', 'oyster', 'Epico', 'Grammar',
        'SUS', 'fresh', 'matilda', 'sonic', 'Egyptian', 'White', 'BLACK', 'Tycoon', 'tunas',
        'brazilian', 'Luigi'
    ],
    arabConnectors: [
        'basically', 'literally', 'unexpected', 'expected', 'lost',
        'lost his shit', 'grinds', 'since', 'I\'m', 'he\'s', 'she\'s', 'le', 'now', 'says',
        'shitted', 'promoted', 'demoted', 'buttered', 'lagging', 'praying', 'died',
        'streaming', 'skydiving', 'trolled', 'goes viral', 'fight', 'gets fired', 'like',
        'love', 'driving', 'could', 'can', 'that', 'this', 'these', 'those', 'who', 'WHEN',
        'so', 'called out', 'on', 'sued', 'cancelled', 'installed', 'removed', 'muting', 'am',
        'are', 'arrested', 'i', 'you', 'he', 'his', 'her', 'she', 'it', 'that', 'the', 'is',
        'was', 'a', 'an', 'watch', 'play', 'gotta', 'get', 'gaming', 'balling', 'yours',
        'mine', 'your', 'you\'re', 'we\'re', 'they\'re', 'our', 'we', 'they', 'them', 'their',
        'wipe', 'born', 'pissing', 'taken off', 'holed', 'off', 'out', 'flood', 'spamming',
        'buy', 'hacking', 'smelling', 'have', 'become', 'be', 'watching', 'Added'
    ],
    psFiles: ['i broke the json'],
    psPasta: ['i broke the json'],
    funnygifs: ['i broke the json'],
    poopPhrases: ['i broke the json'],
    dmPhrases: ['i broke the json'],
    eightball: [
        'I don\'t know.', 'Maybe...', 'I think so.', 'Of course.', 'I don\'t think so.',
        'I can afirm.', 'No, that\'s wrong.', 'Yes, that\'s right.', 'I assume so.', 'Yes.',
        'No.', 'I have no answers.', 'That\'s true.', 'That\'s false.', 'Isn\'t it obvious?'
    ]
}

module.exports = dataValues