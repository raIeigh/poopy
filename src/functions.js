const { os, fs, request, CryptoJS } = require('./modules')
let vars = require('./vars')
let functions = {}

functions.spawn = require('child_process').spawn
functions.exec = require('child_process').exec
functions.getEmojis = require('@jimp/plugin-print/emojis')
functions.lingo = require('./lingo')
functions.gibberish = require('./gibberish')
functions.markov = require('./markov')
functions.wackywebm = require('./wackywebm')
functions.dataGather = require('./dataGathering')
functions.brainfuck = require('./brainfuck')
functions.tobrainfuck = require('./tobrainfuck')
functions.generateSayori = require('./sayorimessagegenerator')
functions.braille = require('./braille')
functions.averageColor = require('./averageColor')
functions.spectrogram = require('./spectrogram')

Math.lerp = function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

String.prototype.toCapperCase = function toCapperCase() {
    return this.toUpperCase().substring(0, 1) + this.toLowerCase().substring(1)
}

functions.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms ?? 0))
}

functions.request = async function (options) {
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return
            }

            try {
                body = JSON.parse(body)
            } catch (_) { }

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

functions.requireJSON = function (path) {
    return JSON.parse(fs.readFileSync(path).toString())
}

functions.regexClean = function (str) {
    return str.replace(/[\\^$.|?*+()[{]/g, (match) => `\\${match}`)
}

functions.escapeHTML = function (value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

functions.unescapeHTML = function (value) {
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

functions.decrypt = function (str, hide) {
    var decrypted = CryptoJS.AES.decrypt(str, process.env.AUTH_TOKEN).toString(CryptoJS.enc.Utf8)

    if (hide) decrypted = decrypted.replace(/./g, '•')

    return decrypted
}

functions.parMatch = function (string) {
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

functions.matchLongestKey = function (str, keys) {
    if (keys.length <= 0) return ['']
    var longest = ['']
    var matched = false
    for (var i in keys) {
        var match = str.match(new RegExp(`^${functions.regexClean(keys[i])}`))
        if (match && match[0].length >= longest[0].length) {
            matched = true
            longest = match
        }
    }
    return matched && longest
}

functions.matchLongestFunc = function (str, funcs) {
    if (funcs.length <= 0) return ['']
    var longest = ['']
    var matched = false
    for (var i in funcs) {
        var match = str.match(new RegExp(`${functions.regexClean(funcs[i])}$`))
        if (match && match[0].length >= longest[0].length) {
            matched = true
            longest = match
        }
    }
    return matched && longest
}

functions.getIndexOption = function (args, i, {
    dft = undefined, n = 1
} = {}) {
    var slice = args.slice(i, i + n)
    return slice.length ? slice : dft
}

functions.getOption = function (args, name, {
    dft = undefined, n = 1, splice = false, join = true, func = (opt) => opt, stopMatch = []
} = {}) {
    var optionindex = args.indexOf(`-${name}`)
    if (optionindex > -1) {
        var option = []
        var splicecount = 0
        for (var i = 1; i <= Math.min(n, args.length - optionindex - 1); i++) {
            if (stopMatch.includes(args[optionindex + i])) break
            splicecount++
            option.push(func(args[optionindex + i], i))
        }
        if (splice) args.splice(optionindex, splicecount + 1)
        if (join) option = option.join(' ')
        return n == 0 ? true : isNaN(Number(option)) ? option : Number(option)
    }
    return dft
}

functions.parseNumber = function (str, {
    dft = undefined, min = -Infinity, max = Infinity, round = false
} = {}) {
    if (str === undefined || str === '') return dft
    var number = Number(str)
    return isNaN(number) ? dft : (round ? Math.round(Math.max(Math.min(number, max), min)) : Math.max(Math.min(number, max), min)) ?? dft
}

functions.parseString = function (str, validList, {
    dft = undefined, lower = false, upper = false
} = {}) {
    if (str == undefined || str === '') return dft
    var query = upper ? str.toUpperCase() : lower ? str.toLowerCase() : str
    return validList.find(q => q == query) || dft
}

functions.equalValues = function (arr, val) {
    var count = 0
    arr.forEach(v => v == val && count++)
    return count
}

functions.randomChoice = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

functions.roundTo = function (n, r) {
    return Math.round(n / r) * r
}

functions.toOrdinal = function (num) {
    num = String(num)
    var thmatch = num.match(/[^1][1-3]$|^[1-3]$/)

    if (thmatch) {
        num += ['st', 'nd', 'rd'][Number(thmatch[0][thmatch[0].length - 1]) - 1]
    } else {
        num += 'th'
    }

    return num
}

functions.randomNumber = function (min, max) {
    if (min == undefined && max == undefined) return Math.random()
    if (max == undefined) {
        max = min
        min = 1
    }

    return Math.floor(Math.random() * (max + 1 - min)) + min
}

functions.shuffle = function (array) {
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

functions.similarity = function (s1, s2) {
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

functions.chunkArray = function (myArray, chunk_size) {
    var arrayLength = myArray.length
    var tempArray = []

    for (var index = 0; index < arrayLength; index += chunk_size) {
        var myChunk = myArray.slice(index, index + chunk_size)
        tempArray.push(myChunk)
    }

    return tempArray;
}

functions.chunkObject = function (object, chunk_size) {
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

functions.generateId = function (existing, length = 10) {
    var charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    var id = ''

    for (var i = 0; i < length; i++) {
        id += charset[Math.floor(Math.random() * charset.length)]
    }

    if (existing && existing.includes(id)) return functions.generateId(existing, length)

    return id
}

functions.tryJSONparse = function (obj) {
    try {
        return JSON.parse(obj)
    } catch (_) {
        return null
    }
}

functions.replaceAsync = async function (str, regex, asyncFn) {
    var promises = []
    str.replace(regex, (match, ...args) => {
        var promise = asyncFn(match, ...args)
        promises.push(promise)
    })
    var data = await Promise.all(promises)
    return str.replace(regex, () => data.shift())
}

functions.findAsync = async function (arr, asyncCallback) {
    var promises = arr.map(asyncCallback)
    var results = await Promise.all(promises)
    var index = results.findIndex(result => result)
    return arr[index]
}

functions.findIndexAsync = async function (arr, asyncCallback) {
    var promises = arr.map(asyncCallback)
    var results = await Promise.all(promises)
    var index = results.findIndex(result => result)
    return index
}

functions.filterAsync = async function (arr, asyncCallback) {
    var promises = arr.map(asyncCallback)
    var results = await Promise.all(promises)
    return arr.filter((val, i) => results[i])
}

functions.markovChainGenerator = function (text) {
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

functions.markovMe = function (markovChain, text = '', options = {}) {
    var words = markovChain.map(chain => chain.word)

    if (words.length <= 0) return 'no markov data for guild, arabotto 2020'

    var wordNumber = options.wordNumber
    var nopunctuation = options.nopunctuation
    var keepcase = options.keepcase
    var randlerp = options.randomlerp ?? 0.4

    var result = text ? text.split(' ') : []
    var chain = markovChain.random()
    var word = result[result.length - 1] || chain.forms[Math.floor(Math.random() * chain.forms.length)]
    result.splice(result.length - 1)
    var maxrepeat = markovChain[0].repeated
    var randomchance = 0
    for (var i = 0; i < (wordNumber || Math.min(words.length, Math.floor(Math.random() * 20) + 1)); i++) {
        result.push(word);
        if (vars.validUrl.test(word) && !wordNumber) break
        var markov = markovChain.findChain(word.toLowerCase())
        var newWord = markov.next[Math.floor(Math.random() * markov.next.length)]
        word = newWord
        randomchance = Math.lerp(randomchance, maxrepeat, randlerp)
        if (!word || !markovChain.findChain(word.toLowerCase()) || Math.floor(Math.random() * randomchance) >= maxrepeat * 0.5) {
            randomchance = 0
            chain = markovChain.random()
            word = chain.forms[Math.floor(Math.random() * chain.forms.length)]
        }
    }
    result = result.join(' ')
    if (!vars.punctuation.find(p => result.match(new RegExp(`[${p}]$`))) && Math.floor(Math.random() * 5) === 0 && !nopunctuation) {
        result += vars.punctuation[Math.floor(Math.random() * vars.punctuation.length)]
    }
    if (Math.floor(Math.random() * 5) === 0 && !keepcase) {
        result = vars.caseModifiers[Math.floor(Math.random() * vars.caseModifiers.length)](result)
    }
    return result
}

functions.findpreset = function (args) {
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

functions.randomKey = function (name) {
    var i = 1
    var keys = []
    while (process.env[name + (i != 1 ? i : '')]) {
        keys.push(process.env[name + (i != 1 ? i : '')])
        i++
    }
    return keys[Math.floor(Math.random() * keys.length)]
}

functions.envsExist = function (envs = []) {
    var exist = true

    envs.forEach(env => {
        if (!process.env[env]) exist = false
    })

    return exist
}

functions.execPromise = function (code) {
    let poopy = this
    let config = poopy.config
    let vars = poopy.vars
    let { fs, os } = poopy.modules
    let { spawn, exec, processTask } = poopy.functions

    return new Promise(async (resolve) => {
        var args = code.match(/("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g)
        var command = args.splice(0, 1)[0]

        async function execTask() {
            var execData = {
                type: 'exec',
                code: code,
                files: vars.processingTools.inputs[command](code.split(' ').slice(1))
            }

            /*var taskLength = JSON.stringify(execData)
            if (taskLength > 15 * 1024 * 1024) {
                return
            }*/

            var result = await processTask(execData).catch(() => { })

            if (!result) {
                return 'No output.'
            }

            if (result.files) {
                var name = vars.processingTools.outputs[command](args)
                var dirsplit = name.split('/')
                var dir = dirsplit.slice(0, dirsplit.length - 1).join('/')

                for (var filename in result.files) {
                    fs.writeFileSync(`${dir}/${filename}`, Buffer.from(result.files[filename], 'base64'))
                }
            }

            return result.std
        }

        if (vars.processingTools.inputs[command] && !config.testing && process.env.CLOUDAMQP_URL) {
            var taskValue = await execTask().catch(() => { })
            resolve(taskValue ?? 'No output.')
            return
        }

        var exargs = code.split(' ')
        exargs[0] = vars.processingTools.names[exargs[0]] ?? exargs[0]
        code = exargs.join(' ')

        args = code.match(/("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g)
        command = args.splice(0, 1)[0]

        var stdout = []
        var stderr = []
        var stdoutclosed = false
        var stderrclosed = false
        var procExited = false

        var proc = spawn(command, args, {
            shell: true,
            env: {
                ...process.env
            }
        })

        var memoryInterval = setInterval(() => {
            var usage = process.memoryUsage()
            var rss = usage.rss
            if ((rss / 1024 / 1024) <= config.memLimit) {
                if (os.platform() == 'win32') exec(`taskkill /pid ${proc.pid} /f /t`)
                else exec(`kill -9 ${proc.pid}`) //proc.kill('SIGKILL')
            }
        }, 1000)

        function handleExit() {
            if (!stdoutclosed || !stderrclosed || !procExited) return
            var out = stdout.join('\n') || stderr.join('\n')
            clearInterval(memoryInterval)
            proc.removeAllListeners()
            resolve(out)
        }

        proc.stdout.on('data', (buffer) => {
            if (!buffer.toString()) return
            stdout.push(buffer.toString())
        })

        proc.stderr.on('data', (buffer) => {
            if (!buffer.toString()) return
            stderr.push(buffer.toString())
        })

        proc.stdout.on('close', () => {
            stdoutclosed = true
            handleExit()
        })

        proc.stderr.on('close', () => {
            stderrclosed = true
            handleExit()
        })

        proc.on('error', (err) => {
            clearInterval(memoryInterval)
            proc.removeAllListeners()
            resolve(err.message)
        })

        proc.on('exit', () => {
            procExited = true
            handleExit()
        })
    })
}

functions.gatherData = async function (msg) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let tempdata = poopy.tempdata
    let vars = poopy.vars

    let { dataGather } = poopy.functions

    var now = Date.now()
    var webhook = await msg.fetchWebhook().catch(() => { })

    if (!webhook) {
        if (!data.userData[msg.author.id]) {
            data.userData[msg.author.id] = !config.testing && process.env.MONGOOSE_URL && await dataGather.userData(config.database, msg.author.id).catch((e) => console.log(e)) || {}
        }
        if (!data.botData.users.includes(msg.author.id)) {
            data.botData.users.push(msg.author.id)
        }

        data.userData[msg.author.id]['username'] = msg.author.username
        if (data.userData[msg.author.id]['dms'] === undefined) {
            data.userData[msg.author.id]['dms'] = false
        }

        for (var stat in vars.battleStats) {
            if (data.userData[msg.author.id][stat] === undefined) {
                data.userData[msg.author.id][stat] = vars.battleStats[stat]
            }
        }

        if (!data.userData[msg.author.id]['tokens']) {
            data.userData[msg.author.id]['tokens'] = {}
        }
        if (!data.userData[msg.author.id]['battleSprites']) {
            data.userData[msg.author.id]['battleSprites'] = {}
        }

        data.botData.leaderboard[msg.author.id] = {
            tag: msg.author.tag,
            bucks: data.userData[msg.author.id]['bucks']
        }
    }

    if (!data.guildData[msg.guild.id]) {
        data.guildData[msg.guild.id] = !config.testing && process.env.MONGOOSE_URL && await dataGather.guildData(config.database, msg.guild.id).catch((e) => console.log(e)) || {}
    }

    if (data.guildData[msg.guild.id]['read'] === undefined) {
        data.guildData[msg.guild.id]['read'] = false
    }

    if (data.guildData[msg.guild.id]['chaincommands'] == undefined) {
        data.guildData[msg.guild.id]['chaincommands'] = true
    }

    if (data.guildData[msg.guild.id]['keyexec'] == undefined) {
        data.guildData[msg.guild.id]['keyexec'] = 1
    }

    if (data.guildData[msg.guild.id]['prefix'] === undefined) {
        data.guildData[msg.guild.id]['prefix'] = config.globalPrefix
    }

    if (!data.guildData[msg.guild.id]['channels']) {
        data.guildData[msg.guild.id]['channels'] = {}
    }

    if (!data.guildData[msg.guild.id]['channels'][msg.channel.id]) {
        data.guildData[msg.guild.id]['channels'][msg.channel.id] = !config.testing && process.env.MONGOOSE_URL && await dataGather.channelData(config.database, msg.guild.id, msg.channel.id).catch((e) => console.log(e)) || {}
    }

    if (!data.guildData[msg.guild.id]['channels'][msg.channel.id]['lastUrls']) {
        data.guildData[msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = []
    }

    if (data.guildData[msg.guild.id]['channels'][msg.channel.id]['read'] === undefined) {
        data.guildData[msg.guild.id]['channels'][msg.channel.id]['read'] = false
    }

    if (data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw'] === undefined) {
        data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw'] = !!msg.channel.nsfw
    }

    var channelFetch = await msg.channel.fetch(true).catch(() => { })
    var nsfwChanged = channelFetch && channelFetch.nsfw != msg.channel.onsfw
    if (msg.channel.onsfw == undefined || nsfwChanged) {
        msg.channel.onsfw = !!(channelFetch || msg.channel).nsfw
        if (nsfwChanged) data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw'] = !!channelFetch.nsfw
    }

    msg.channel.nsfw = !!data.guildData[msg.guild.id]['channels'][msg.channel.id]['nsfw']

    if (!webhook) {
        if (!data.guildData[msg.guild.id]['members']) {
            data.guildData[msg.guild.id]['members'] = {}
        }

        if (!data.guildData[msg.guild.id]['members'][msg.author.id]) {
            data.guildData[msg.guild.id]['members'][msg.author.id] = !config.testing && process.env.MONGOOSE_URL && await dataGather.memberData(config.database, msg.guild.id, msg.author.id).catch((e) => console.log(e)) || {}
        }

        if (!data.guildData[msg.guild.id]['members'][msg.author.id]['messages']) {
            data.guildData[msg.guild.id]['members'][msg.author.id]['messages'] = 0
        }

        if (!data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown']) {
            data.guildData[msg.guild.id]['members'][msg.author.id]['coolDown'] = false
        }

        if (!data.guildData[msg.guild.id]['allMembers']) {
            data.guildData[msg.guild.id]['allMembers'] = {}
        }

        if (!data.guildData[msg.guild.id]['allMembers'][msg.author.id]) {
            data.guildData[msg.guild.id]['allMembers'][msg.author.id] = {}
        }

        if (!data.guildData[msg.guild.id]['allMembers'][msg.author.id]['messages']) {
            data.guildData[msg.guild.id]['allMembers'][msg.author.id]['messages'] = 0
        }

        data.guildData[msg.guild.id]['members'][msg.author.id]['messages']++
        data.guildData[msg.guild.id]['members'][msg.author.id]['username'] = msg.author.username
        data.guildData[msg.guild.id]['members'][msg.author.id]['lastmessage'] = now

        data.guildData[msg.guild.id]['allMembers'][msg.author.id]['messages']++
        data.guildData[msg.guild.id]['allMembers'][msg.author.id]['username'] = msg.author.username
        data.guildData[msg.guild.id]['allMembers'][msg.author.id]['lastmessage'] = now
    }

    if (!data.guildData[msg.guild.id]['disabled']) {
        data.guildData[msg.guild.id]['disabled'] = config.defaultDisabled
    }

    if (!data.guildData[msg.guild.id]['localcmds']) {
        data.guildData[msg.guild.id]['localcmds'] = []
    }

    if (!data.guildData[msg.guild.id]['messages']) {
        data.guildData[msg.guild.id]['messages'] = []
    }

    data.guildData[msg.guild.id]['messages'] = data.guildData[msg.guild.id]['messages'].filter(m => now - m.timestamp < 1000 * 60 * 60 * 24 * 30)

    if (!tempdata[msg.guild.id]) {
        tempdata[msg.guild.id] = {}
    }

    if (!tempdata[msg.guild.id][msg.channel.id]) {
        tempdata[msg.guild.id][msg.channel.id] = {}
    }

    if (!webhook) {
        if (!tempdata[msg.guild.id][msg.channel.id][msg.author.id]) {
            tempdata[msg.guild.id][msg.channel.id][msg.author.id] = {}
        }

        if (!tempdata[msg.guild.id][msg.author.id]) {
            tempdata[msg.guild.id][msg.author.id] = {}
        }

        if (!tempdata[msg.guild.id][msg.author.id]['promises']) {
            tempdata[msg.guild.id][msg.author.id]['promises'] = []
        }

        if (!tempdata[msg.author.id]) {
            tempdata[msg.author.id] = {}
        }

        if (!tempdata[msg.author.id][msg.id]) {
            tempdata[msg.author.id][msg.id] = {}
        }

        if (!tempdata[msg.author.id][msg.id]['execCount']) {
            tempdata[msg.author.id][msg.id]['execCount'] = 0
        }

        if (!tempdata[msg.author.id]['cooler']) {
            tempdata[msg.author.id]['cooler'] = msg.id
        }

        if (!tempdata[msg.author.id]['arrays']) {
            tempdata[msg.author.id]['arrays'] = {}
        }

        if (!tempdata[msg.author.id]['declared']) {
            tempdata[msg.author.id]['declared'] = {}
        }

        if (!tempdata[msg.author.id]['promises']) {
            tempdata[msg.author.id]['promises'] = []
        }

        if (!tempdata[msg.author.id]['lastmention']) {
            tempdata[msg.author.id]['lastmention'] = 0
        }

        if (!tempdata[msg.author.id]['mentions']) {
            tempdata[msg.author.id]['mentions'] = 0
        }
    }
}

functions.cleverbot = async function (stim, id) {
    let poopy = this
    let bot = poopy.bot
    let vars = poopy.vars
    let arrays = poopy.arrays
    let { axios, CryptoJS } = poopy.modules
    let { userToken, randomChoice } = poopy.functions

    var context = vars.clevercontexts[bot.id + id] || (vars.clevercontexts[bot.id + id] = [])
    if (context.length > 10) context.splice(0, context.length - 10)

    async function clever() {
        function encodeForSending(a) {
            var f = ""
            var d = ""
            a = a.replace(/[|]/g, "{*}")
            for (var b = 0; b <= a.length; b++) {
                if (a.charCodeAt(b) > 255) {
                    d = escape(a.charAt(b))
                    if (d.substring(0, 2) == "%u") {
                        f += "|" + d.substring(2, d.length)
                    } else {
                        f += d
                    }
                } else {
                    f += a.charAt(b)
                }
            }
            f = f.replace("|201C", "'").replace("|201D", "'").replace("|2018", "'").replace("|2019", "'").replace("`", "'").replace("%B4", "'").replace("|FF20", "").replace("|FE6B", "")
            return escape(f)
        }

        var UA = 'Mozilla/5.0 (X11; U; Linux i686; it; rv:1.9.2.3) Gecko/20100406 Firefox/3.6.3 (Swiftfox)'

        if (!vars.cleverbotJar) vars.cleverbotJar = await axios.get("https://www.cleverbot.com/extras/conversation-social-min.js", {
            headers: {
                "User-Agent": UA
            }
        }).then(res => res.headers['set-cookie'][0].split(";")[0]).catch(() => { })
        var jar = vars.cleverbotJar

        var payload = `stimulus=${encodeForSending(stim)}`
        var l = context.length - 1
        for (var i = 0; i <= l; i++) {
            payload += `&vText${i + 2}=${encodeForSending(context[l - i])}`
        }
        payload += `&cb_settings_language=en&cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`
        payload += CryptoJS.MD5(payload.substring(7, 33)).toString()
        var res = await axios({
            method: "POST",
            url: "https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2&",
            data: payload,
            headers: {
                "Content-Type": "text/plain",
                Cookie: jar,
                "User-Agent": UA
            }
        })
            .then(a => a.data.split("\r")[0])
            .catch(() => '')
        return res
    }

    async function gamer() {
        var options = {
            method: 'GET',
            url: 'https://random-stuff-api.p.rapidapi.com/ai',
            params: {
                msg: stim,
                bot_name: bot.user.username,
                bot_gender: 'male',
                bot_master: 'raleigh',
                bot_age: String(new Date(Date.now() - 1031690078000).getUTCFullYear() - 1970),
                bot_company: 'poopy\'s lounge',
                bot_location: 'Nigeria',
                bot_email: 'poopystinkystinky@gmail.com',
                bot_build: 'private',
                bot_birth_year: '2002',
                bot_birth_date: '10th September, 2002',
                bot_birth_place: 'Nigeria',
                bot_favorite_color: 'yellow',
                bot_favorite_book: 'Diary of a Wimpy Kid',
                bot_favorite_band: 'Radiohead',
                bot_favorite_artist: 'Kanye West',
                bot_favorite_actress: 'nonexistent',
                bot_favorite_actor: 'MoistCr1TiKaL',
                id: id
            },
            headers: {
                authorization: userToken(id, 'RANDOMSTUFF_KEY'),
                'x-rapidapi-host': 'random-stuff-api.p.rapidapi.com',
                'x-rapidapi-key': userToken(id, 'RAPIDAPI_KEY')
            }
        }

        var res = await axios(options).catch(() => { }) ?? { data: { AIResponse: '' } }

        return res.data.AIResponse
    }

    var response = await clever().catch(() => { })
    if (!response && process.env.RANDOMSTUFF_KEY) response = await gamer().catch(() => { })
    if (!response) response = randomChoice(arrays.eightball)

    if (id != undefined && response) {
        context.push(stim)
        context.push(response)
    }

    return response
}

functions.processTask = async function (data) {
    let poopy = this
    let vars = poopy.vars
    let { generateId, tryJSONparse } = poopy.functions

    return new Promise(async (resolve, reject) => {
        try {
            var ch = await vars.amqpconn.createChannel().catch(reject)
            var q = await ch.assertQueue('', { exclusive: true }).catch(reject)
            var correlationId = generateId()

            await ch.assertExchange('crash', 'fanout', {
                durable: false
            }).catch(reject)
            var qrash = await ch.assertQueue('', { exclusive: true }).catch(reject)
            ch.bindQueue(qrash.queue, 'crash', '')

            async function closeAll() {
                await ch.cancel(consumer.consumerTag).catch(() => { })
                await ch.cancel(crashconsumer.consumerTag).catch(() => { })
                await ch.deleteQueue(q.queue).catch(() => { })
                await ch.deleteQueue(qrash.queue).catch(() => { })
                await ch.close().catch(() => { })
                delete ch
            }

            var chunkdata = []

            var consumer = await ch.consume(q.queue, function (msg) {
                if (msg.properties.correlationId == correlationId) {
                    var content = msg.content.toString()

                    var order = Number(content.substring(0, 3))
                    var chunk = content.substring(3)
                    chunkdata.push({ order, chunk })
                    chunkdata.sort((a, b) => a.order - b.order)

                    var chunkjoin = chunkdata.map(c => c.chunk).join('')
                    var data = tryJSONparse(chunkjoin)
                    if (data) {
                        delete chunkdata
                        closeAll()
                        resolve(data)
                    }
                }
            }, { noAck: true }).catch(reject)

            var crashconsumer = await ch.consume(qrash.queue, function (msg) {
                closeAll()
                reject(msg.content.toString())
            }, { noAck: true }).catch(reject)

            var reqdata = Buffer.from(JSON.stringify(data))
            var msgSizeLimit = 1024 * 1024 * 8 - 3
            var msgNum = Math.ceil(reqdata.length / msgSizeLimit)

            for (var i = 0; i < msgNum; i++) {
                var chunk = reqdata.subarray(msgSizeLimit * i, msgSizeLimit * (i + 1))
                var ordchunk = Buffer.concat([Buffer.from(String(i).padStart(3, '0')), chunk])
                ch.sendToQueue('tasks', ordchunk, {
                    correlationId: correlationId,
                    replyTo: q.queue
                })
            }

            delete reqdata
        } catch (err) {
            reject(err)
        }
    })
}

functions.infoPost = async function (message) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let { averageColor } = poopy.functions

    if (config.stfu || config.noInfoPost) return

    var avatar = bot.user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' })
    var color = os.platform() == 'win32' ? { r: 255, g: 255, b: 255 } : await averageColor(avatar)

    var infoChannel = bot.guilds.cache.get('834431435704107018')?.channels.cache.get('967083645619830834')
    if (!infoChannel) return

    if (config.textEmbeds) await infoChannel.send({
        content: message,
        allowedMentions: {
            parse: ['users']
        }
    }).catch(() => { })
    else await infoChannel.send({
        embeds: [{
            description: message,
            author: {
                name: bot.user.username,
                icon_url: avatar,
            },
            color: (color.r << 8 << 8) + (color.g << 8) + (color.b)
        }]
    }).catch(() => { })
}

functions.getKeyFunc = function (string, { extrakeys = {}, extrafuncs = {}, declaredonly = false } = {}) {
    let poopy = this
    let special = poopy.special
    let { matchLongestFunc, matchLongestKey } = poopy.functions

    var lastParenthesesIndex = -1
    var llastParenthesesIndex = -1
    var rawParenthesesIndex = -1
    var rawrequired = 0
    var keyindex = -1
    var parindex = -1
    var parenthesesGoal = []
    var potentialindexes = []
    var rawMatch

    var keylist = declaredonly ? {} : { ...special.keys }
    var funclist = declaredonly ? {} : { ...special.functions }
    var pfunclist = []

    for (var k in keylist) {
        if (keylist[k].potential) {
            if (keylist[k].potential.funcs) {
                for (var ff in keylist[k].potential.funcs) {
                    pfunclist[ff] = keylist[k].potential.funcs[ff]
                }
            }
        }
    }
    for (var k in extrakeys) keylist[k] = extrakeys[k]

    for (var f in funclist) {
        if (funclist[f].potential) {
            if (funclist[f].potential.funcs) {
                for (var ff in funclist[f].potential.funcs) {
                    pfunclist[ff] = funclist[f].potential.funcs[ff]
                }
            }
        }
    }
    for (var f in extrafuncs) funclist[f] = extrafuncs[f]

    var keys = Object.keys(keylist).sort((a, b) => b.length - a.length)
    var funcs = Object.keys(funclist).sort((a, b) => b.length - a.length)
    var pfuncs = Object.keys(pfunclist).sort((a, b) => b.length - a.length)

    var keyfiltered = keys.filter((key) => string.includes(key))
    var funcfiltered = funcs.filter((func) => string.includes(`${func}(`))
    var pfuncfiltered = pfuncs.filter((pfunc) => string.includes(`${pfunc}(`))
    var keyfirstletters = keyfiltered.map(key => key[0]).filter(function (item, pos, self) {
        return self.indexOf(item) == pos
    })

    if ((keyfiltered.length <= 0 && funcfiltered.length <= 0) || string.length > 1024 * 1024) return false

    for (var i in string) {
        var char = string[i]

        if (funcfiltered.length > 0 || pfuncfiltered.length > 0)
            switch (char) {
                case '(':
                    var funcmatch = matchLongestFunc(string.substring(0, i), funcfiltered) // get real function
                    var pfuncmatch = matchLongestFunc(string.substring(0, i), parenthesesGoal.length <= 0 ? pfuncfiltered : ['']) // get probable functions (like resettimer())

                    if (funcmatch) {
                        parindex++ // open parentheses found
                        lastParenthesesIndex = i // set the index of the last parentheses
                        if (!rawMatch) {
                            var func = funclist[funcmatch[0]]
                            if (func) {
                                if (func.raw) {
                                    rawParenthesesIndex = i
                                    rawrequired++
                                    rawMatch = funcmatch[0]
                                } // if the function is raw, activate raw setting

                                if (func.parentheses) {
                                    parenthesesGoal.push(parindex - 1)
                                } // if the function uses parentheses inside, activate whole parentheses setting
                            }
                        } else {
                            rawrequired++
                        } // if the function isnt inside a raw one, execute it like normal, else add a requirement for raw parentheses
                    } else if (pfuncmatch || pfuncmatch == '') {
                        parindex++ // open parentheses found
                        potentialindexes.push(parindex)
                    }
                    break

                case ')':
                    var funcmatch = matchLongestFunc(string.substring(0, lastParenthesesIndex), funcfiltered)

                    if (funcmatch && string[i - 1] !== '\\') {
                        if (parenthesesGoal.find(pgoal => parindex == pgoal)) {
                            parenthesesGoal.splice(parenthesesGoal.findIndex(pgoal => parindex == pgoal), 1)
                        }
                        if (potentialindexes.find(ind => ind === parindex)) {
                            potentialindexes.splice(potentialindexes.findIndex(ind => ind === parindex), 1)
                        } else {
                            if (!rawMatch) {
                                lastParenthesesIndex++
                                return {
                                    match: [funcmatch[0], string.substring(lastParenthesesIndex, i)],
                                    type: 'func'
                                }
                            } else {
                                rawrequired--
                                llastParenthesesIndex = i
                                if (rawrequired <= 0) {
                                    rawParenthesesIndex++
                                    return {
                                        match: [rawMatch, string.substring(rawParenthesesIndex, i)],
                                        type: 'func'
                                    }
                                }
                            }
                        }
                        parindex-- // closed parentheses found
                    }
                    break
            }

        if (keyfiltered.length > 0 && keyfirstletters.includes(char)) {
            var keymatch = matchLongestKey(string.substring(i), keys)
            if (keymatch) {
                keyindex = i
                if (rawrequired <= 0) return {
                    match: keymatch[0],
                    type: 'key'
                }
            }
        }
    }

    if (llastParenthesesIndex > -1) {
        var funcmatch = matchLongestFunc(string.substring(0, lastParenthesesIndex), funcfiltered)

        lastParenthesesIndex++
        return {
            match: [funcmatch[0], string.substring(lastParenthesesIndex, llastParenthesesIndex)],
            type: 'func'
        }
    }

    if (keyindex > -1) {
        var keymatch = matchLongestKey(string.substring(keyindex), keys)

        return {
            match: keymatch[0],
            type: 'key'
        }
    }

    return false
}

functions.splitKeyFunc = function (string, { extrafuncs = {}, args = Infinity, separator = '|', declaredonly = false } = {}) {
    let poopy = this
    let special = poopy.special
    let { matchLongestFunc } = poopy.functions

    var isDefaultSeparator = separator == '|'
    var lastParenthesesIndex = -1
    var lastSplitIndex = 0
    var parenthesesrequired = 0
    var parenthesesGoal = []
    var barfound = 0
    var split = []

    var funclist = declaredonly ? {} : { ...special.functions }
    var pfunclist = []

    for (var f in funclist) {
        if (funclist[f].potential) {
            if (funclist[f].potential.funcs) {
                for (var ff in funclist[f].potential.funcs) {
                    pfunclist[ff] = funclist[f].potential.funcs[ff]
                }
            }
        }
    }
    for (var f in extrafuncs) funclist[f] = extrafuncs[f]

    var funcs = Object.keys(funclist).sort((a, b) => b.length - a.length)
    var pfuncs = Object.keys(pfunclist).sort((a, b) => b.length - a.length)
    var afuncs = funcs.concat(pfuncs).sort((a, b) => b.length - a.length)

    var afuncfiltered = afuncs.filter((afunc) => string.includes(`${afunc}(`))

    for (var i in string) {
        var char = string[i]
        i = Number(i)

        switch (char) {
            case '(':
                if (afuncfiltered.length > 0) {
                    var funcmatch = matchLongestFunc(string.substring(0, i), parenthesesGoal.length <= 0 ? afuncfiltered : [''])
                    if (funcmatch) {
                        lastParenthesesIndex = i
                        parenthesesrequired++
                        var func = funclist[funcmatch[0]]
                        if (func) {
                            if (func.parentheses) {
                                parenthesesGoal.push(parenthesesrequired - 1)
                            }
                        }
                    }
                }
                break

            case separator:
                if (parenthesesrequired <= 0 && string[i - 1] !== '\\') {
                    split.push(string.substring(lastSplitIndex, i - ((string[i - 1] === ' ' && isDefaultSeparator) ? 1 : 0)))
                    lastSplitIndex = i + ((string[i + 1] === ' ' && isDefaultSeparator) ? 2 : 1)
                    barfound++
                }
                break

            case ')':
                if (afuncfiltered.length > 0) {
                    var funcmatch = matchLongestFunc(string.substring(0, lastParenthesesIndex), parenthesesGoal.length <= 0 ? afuncfiltered : [''])
                    if (funcmatch && string[i - 1] !== '\\') {
                        if (parenthesesGoal.find(pgoal => parenthesesrequired == pgoal)) {
                            parenthesesGoal.splice(parenthesesGoal.findIndex(pgoal => parenthesesrequired == pgoal), 1)
                        }
                        parenthesesrequired--
                    }
                }
                break
        }

        if (barfound == args - 1) {
            break
        }
    }

    split.push(string.substring(lastSplitIndex))

    return split.map(val => isDefaultSeparator ? val.replace(/\\\|/, '|') : val)
}

functions.yesno = async function (channel, content, who, btdata, reply) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let { chunkArray, dmSupport } = poopy.functions
    let { Discord } = poopy.modules

    return new Promise(async (resolve) => {
        if (config.forcetrue) {
            resolve(true)
            return
        }

        var sendObject = {
            content: content
        }

        if (typeof (who) != 'string') {
            sendObject.allowedMentions = {
                parse: (!who.permissions.has('Administrator') &&
                    !who.permissions.has('MentionEveryone') &&
                    who.id !== channel.guild.ownerID) ?
                    ['users'] : ['users', 'everyone', 'roles']
            }
            who = who.id
        }

        var buttonsData = btdata ?? [
            {
                emoji: '874406154619469864',
                reactemoji: '✅',
                customid: 'yes',
                style: Discord.ButtonStyle.Success,
                resolve: true
            },

            {
                emoji: '874406183933444156',
                reactemoji: '❌',
                customid: 'no',
                style: Discord.ButtonStyle.Danger,
                resolve: false
            }
        ]

        if (!config.useReactions) {
            var components = []

            var chunkButtonData = chunkArray(buttonsData, 5)

            chunkButtonData.forEach(buttonsData => {
                var buttonRow = new Discord.ActionRowBuilder()
                var buttons = []

                buttonsData.forEach(bdata => {
                    var button = new Discord.ButtonBuilder()
                        .setStyle(bdata.style)
                        .setEmoji(bdata.emoji)
                        .setCustomId(bdata.customid)

                    buttons.push(button)
                })

                buttonRow.addComponents(buttons)

                components.push(buttonRow)
            })

            sendObject.components = components
        }

        var yesnoMsg = await (reply ?? channel)[reply ? 'reply' : 'send'](sendObject).catch(() => { })

        if (!yesnoMsg) {
            resolve(false)
            return
        }

        if (config.useReactions) {
            var collector = yesnoMsg.createReactionCollector({ time: 30_000 })

            collector.on('collect', (reaction, user) => {
                dmSupport(reaction)

                if (!(user.id === who && ((user.id !== bot.user.id && !user.bot) || config.allowbotusage))) {
                    return
                }

                var buttonData = buttonsData.find(bdata => bdata.reactemoji == reaction.emoji.toString())

                if (buttonData) {
                    collector.stop()
                    resolve(buttonData.resolve)
                }
            })

            collector.on('end', (_, reason) => {
                if (reason == 'time') {
                    yesnoMsg.edit({
                        content: 'No response.'
                    }).catch(() => { })
                    yesnoMsg.reactions.removeAll().catch(() => { })
                    resolve(false)
                } else {
                    yesnoMsg.delete().catch(() => { })
                }
            })

            for (var i in buttonsData) {
                var bdata = buttonsData[i]
                await yesnoMsg.react(bdata.reactemoji).catch(() => { })
                collector.resetTimer()
            }
        } else {
            var collector = yesnoMsg.createMessageComponentCollector({ time: 30_000 })

            collector.on('collect', (button) => {
                dmSupport(button)

                button.deferUpdate().catch(() => { })

                if (!(button.user.id === who && ((button.user.id !== bot.user.id && !button.user.bot) || config.allowbotusage))) {
                    return
                }

                var buttonData = buttonsData.find(bdata => bdata.customid == button.customId)

                if (buttonData) {
                    collector.stop()
                    resolve(buttonData.resolve)
                }
            })

            collector.on('end', (_, reason) => {
                if (reason == 'time') {
                    yesnoMsg.edit({
                        content: 'No response.',
                        components: []
                    }).catch(() => { })
                    resolve(false)
                } else {
                    yesnoMsg.delete().catch(() => { })
                }
            })
        }
    })
}

functions.selectMenu = async function (channel, content, placeholder, options, exception, who) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let { dmSupport } = poopy.functions
    let { Discord } = poopy.modules

    return new Promise(async (resolve) => {
        if (config.useReactions) {
            resolve(exception)
            return
        }

        var sendObject = {
            content: content
        }

        if (typeof (who) != 'string') {
            sendObject.allowedMentions = {
                parse: (!who.permissions.has('Administrator') &&
                    !who.permissions.has('MentionEveryone') &&
                    who.id !== channel.guild.ownerID) ?
                    ['users'] : ['users', 'everyone', 'roles']
            }
            who = who.id
        }

        var menuRow = new Discord.ActionRowBuilder()
        var menu = new Discord.SelectMenuBuilder()
            .setCustomId('selectMenu')
            .setPlaceholder(placeholder)
            .addOptions(options)

        menuRow.addComponents([menu])
        sendObject.components = [menuRow]

        var selectMsg = await channel.send(sendObject).catch(() => { })

        if (!selectMsg) {
            resolve(exception)
            return
        }

        var collector = selectMsg.createMessageComponentCollector({ time: 60_000 })

        collector.on('collect', (option) => {
            dmSupport(option)

            option.deferUpdate().catch(() => { })

            if (!(option.user.id === who && ((option.user.id !== bot.user.id && !option.user.bot) || config.allowbotusage))) {
                return
            }

            collector.stop()
            resolve(option.values[0])
        })

        collector.on('end', (_, reason) => {
            if (reason == 'time') {
                selectMsg.edit({
                    content: 'No response.',
                    components: []
                }).catch(() => { })
                resolve(exception)
            } else {
                selectMsg.delete().catch(() => { })
            }
        })
    })
}

functions.navigateEmbed = async function (channel, pageFunc, results, who, extraButtons, page, selectMenu, errOnFail, endFunc, reply, nolimit) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let tempdata = poopy.tempdata
    let { chunkArray, dmSupport, parseNumber } = poopy.functions
    let { Discord } = poopy.modules

    page = page ?? 1

    var buttonsData = [
        {
            emoji: '861253229726793728',
            reactemoji: '⬅️',
            customid: 'previous',
            style: Discord.ButtonStyle.Primary,
            function: async () => page - 1,
            page: true
        },

        {
            emoji: '861253230070988860',
            reactemoji: '🔀',
            customid: 'random',
            style: Discord.ButtonStyle.Primary,
            function: async () => Math.floor(Math.random() * results) + 1,
            page: true
        },

        {
            emoji: '861253229798621205',
            reactemoji: '➡️',
            customid: 'next',
            style: Discord.ButtonStyle.Primary,
            function: async () => page + 1,
            page: true
        },

        {
            emoji: '970292877785727036',
            reactemoji: '🔢',
            customid: 'page',
            style: Discord.ButtonStyle.Primary,
            function: async (_, interaction) => new Promise(async resolve => {
                var newpage = page

                if (config.useReactions) {
                    var goMessage = await channel.send('Which page would you like to go...?').catch(() => { })

                    var pageCollector = channel.createMessageCollector({ time: 30000 })

                    pageCollector.on('collect', (msg) => {
                        dmSupport(msg)

                        if (!(msg.author.id === who && ((msg.author.id !== bot.user.id && !msg.author.bot) || config.allowbotusage))) {
                            return
                        }

                        newpage = parseNumber(msg.content, { dft: page, min: 1, max: results, round: true })
                        pageCollector.stop()
                        msg.delete().catch(() => { })
                    })

                    pageCollector.on('end', () => {
                        if (goMessage) goMessage.delete().catch(() => { })
                        resolve(newpage)
                    })
                } else {
                    var pageModal = new Discord.ModalBuilder()
                        .setCustomId('page-modal')
                        .setTitle('Select your page...')
                        .addComponents(
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.TextInputBuilder()
                                    .setCustomId('page-num')
                                    .setLabel('Page')
                                    .setStyle(Discord.TextInputStyle.Short)
                                    .setMinLength(1)
                                    .setMaxLength(String(results).length)
                                    .setPlaceholder(`1-${results}`)
                                    .setRequired(true)
                            )
                        )

                    interaction.showModal(pageModal).then(() => {
                        var done = false

                        var modalCallback = (modal) => {
                            if (modal.type !== Discord.InteractionType.ModalSubmit) return

                            if (modal.deferUpdate) modal.deferUpdate().catch(() => { })

                            if (!(modal.user.id === who && ((modal.user.id !== bot.user.id && !modal.user.bot) || config.allowbotusage)) || done) {
                                return
                            }

                            done = true
                            newpage = parseNumber(modal.fields.getTextInputValue('page-num'), { dft: page, min: 1, max: results, round: true })
                            clearTimeout(modalTimeout)
                            resolve(newpage)
                        }

                        var modalTimeout = setTimeout(() => {
                            if (!done) {
                                done = true
                                bot.removeListener('interactionCreate', modalCallback)
                                resolve(newpage)
                            }
                        }, 30000)

                        bot.once('interactionCreate', modalCallback)
                    }).catch(() => resolve(newpage))
                }
            }),
            page: true
        }
    ].concat(extraButtons || [])

    var components = []

    if (!config.useReactions) {
        var chunkButtonData = chunkArray(buttonsData, 5)

        chunkButtonData.forEach(buttonsData => {
            var buttonRow = new Discord.ActionRowBuilder()
            var buttons = []

            buttonsData.forEach(bdata => {
                var button = new Discord.ButtonBuilder()
                    .setStyle(bdata.style)
                    .setEmoji(bdata.emoji)
                    .setCustomId(bdata.customid)

                buttons.push(button)
            })

            buttonRow.addComponents(buttons)

            components.push(buttonRow)
        })
    }

    var resultEmbed = await pageFunc(page).catch(() => { })
    var sendObject = {
        components: components.slice()
    }
    var allowedMentions

    if (selectMenu) {
        var menuRow = new Discord.ActionRowBuilder()
        var menu = new Discord.SelectMenuBuilder()
            .setCustomId(selectMenu.customid)
            .setPlaceholder(selectMenu.text)
            .addOptions(selectMenu.options)

        menuRow.addComponents([menu])

        buttonsData.push(selectMenu)
        sendObject.components.push(menuRow)
    }

    if (typeof (who) != 'string') {
        allowedMentions = {
            parse: (!who.permissions.has('Administrator') &&
                !who.permissions.has('MentionEveryone') &&
                who.id !== channel.guild.ownerID) ?
                ['users'] : ['users', 'everyone', 'roles']
        }
        sendObject.allowedMentions = allowedMentions
        who = who.id
    }

    if (config.textEmbeds) sendObject.content = resultEmbed
    else sendObject.embeds = [resultEmbed]

    var resultsMsg = await (reply ?? channel)[reply ? 'reply' : 'send'](sendObject).catch(() => { })

    if (!resultsMsg) {
        if (errOnFail) throw new Error(`Couldn't send navigable embed to channel`)
        else return
    }

    var usingButton = false

    if (!nolimit) {
        var lastCollectors = tempdata[who]['navigateCollectors']
        if (lastCollectors && lastCollectors.length) lastCollectors.forEach(lastCollector => {
            if (lastCollector.stop) lastCollector.stop()
        })
        tempdata[who]['navigateCollectors'] = []
    }

    if (config.useReactions) {
        var collector = resultsMsg.createReactionCollector({ time: 300_000 })
        tempdata[who]['navigateCollectors'].push(collector)

        collector.on('collect', async (reaction, user) => {
            dmSupport(reaction)

            if (!(user.id === who && ((user.id !== bot.user.id && !user.bot) || config.allowbotusage)) || usingButton) {
                return
            }

            var buttonData = buttonsData.find(bdata => bdata.reactemoji == reaction.emoji.name)

            if (buttonData) {
                usingButton = true
                collector.resetTimer()

                var newpage = await buttonData.function(page, reaction, resultsMsg, collector)
                reaction.users.remove(user).catch(() => { })

                if (buttonData.page) {
                    if (newpage < 1 || newpage > results || newpage == page) {
                        usingButton = false
                        return
                    }

                    page = newpage

                    var resultEmbed = await pageFunc(page).catch(() => { })
                    var sendObject = {
                        components: components.slice()
                    }

                    if (allowedMentions) sendObject.allowedMentions = allowedMentions

                    if (config.textEmbeds) sendObject.content = resultEmbed
                    else sendObject.embeds = [resultEmbed]

                    resultsMsg.edit(sendObject).catch(() => { })
                }
                usingButton = false
            }
        })

        collector.on('end', async (_, reason) => {
            var index = tempdata[who]['navigateCollectors'].indexOf(collector)
            tempdata[who]['navigateCollectors'].splice(index, 1)

            var resultEmbed = await pageFunc(page, true).catch(() => { })
            var sendObject = {}

            if (allowedMentions) sendObject.allowedMentions = allowedMentions

            if (config.textEmbeds) sendObject.content = resultEmbed
            else sendObject.embeds = [resultEmbed]

            resultsMsg.edit(sendObject).catch(() => { })

            resultsMsg.reactions.removeAll().catch(() => { })
            if (endFunc) endFunc(reason, page, resultsMsg)
        })

        for (var i in buttonsData) {
            var bdata = buttonsData[i]
            await resultsMsg.react(bdata.reactemoji).catch(() => { })
        }
    } else {
        var collector = resultsMsg.createMessageComponentCollector({ time: 300_000 })
        tempdata[who]['navigateCollectors'].push(collector)

        collector.on('collect', async (button) => {
            dmSupport(button)

            if (!(button.user.id === who && ((button.user.id !== bot.user.id && !button.user.bot) || config.allowbotusage)) || usingButton) {
                button.deferUpdate().catch(() => { })
                return
            }

            var buttonData = buttonsData.find(bdata => bdata.customid == button.customId)

            if (buttonData) {
                usingButton = true
                collector.resetTimer()

                var newpage = await buttonData.function(page, button, resultsMsg, collector)
                button.deferUpdate().catch(() => { })

                if (buttonData.page) {
                    if (newpage < 1 || newpage > results || newpage == page) {
                        usingButton = false
                        return
                    }

                    page = newpage

                    var resultEmbed = await pageFunc(page).catch(() => { })
                    var sendObject = {
                        components: components.slice()
                    }

                    if (selectMenu) {
                        var menuRow = new Discord.ActionRowBuilder()
                        var menu = new Discord.SelectMenuBuilder()
                            .setCustomId(selectMenu.customid)
                            .setPlaceholder(resultEmbed.menuText || selectMenu.text)
                            .addOptions(selectMenu.options)

                        menuRow.addComponents([menu])

                        sendObject.components.push(menuRow)

                        if (resultEmbed.menuText) delete resultEmbed.menuText
                    }

                    if (allowedMentions) sendObject.allowedMentions = allowedMentions

                    if (config.textEmbeds) sendObject.content = resultEmbed
                    else sendObject.embeds = [resultEmbed]

                    resultsMsg.edit(sendObject).catch(() => { })
                }
                usingButton = false
            }
        })

        collector.on('end', async (_, reason) => {
            var index = tempdata[who]['navigateCollectors'].indexOf(collector)
            tempdata[who]['navigateCollectors'].splice(index, 1)

            var resultEmbed = await pageFunc(page, true).catch(() => { })
            var sendObject = {
                components: []
            }

            if (allowedMentions) sendObject.allowedMentions = allowedMentions

            if (config.textEmbeds) sendObject.content = resultEmbed
            else sendObject.embeds = [resultEmbed]

            resultsMsg.edit(sendObject).catch(() => { })

            if (endFunc) endFunc(reason, page, resultsMsg)
        })
    }
}

functions.rainmaze = async function (channel, who, reply, w = 8, h = 6) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let data = poopy.data
    let { chunkArray, dmSupport, randomNumber } = poopy.functions
    let { Discord, Rainmaze } = poopy.modules

    var buttonsData = config.useReactions ? [
        {
            emoji: '861253229726793728',
            reactemoji: '⬅️',
            customid: 'left',
            style: Discord.ButtonStyle.Primary,
            control: true
        },

        {
            emoji: '1030784553738063882',
            reactemoji: '⬆️',
            customid: 'up',
            style: Discord.ButtonStyle.Primary,
            control: true
        },

        {
            emoji: '1030784552081293383',
            reactemoji: '⬇️',
            customid: 'down',
            style: Discord.ButtonStyle.Primary,
            control: true
        },

        {
            emoji: '861253229798621205',
            reactemoji: '➡️',
            customid: 'right',
            style: Discord.ButtonStyle.Primary,
            control: true
        }
    ] : [
        {
            emoji: '1030786210555248640',
            customid: 'null1',
            style: Discord.ButtonStyle.Secondary,
            control: false
        },

        {
            emoji: '1030784553738063882',
            reactemoji: '⬆️',
            customid: 'up',
            style: Discord.ButtonStyle.Primary,
            control: true
        },

        {
            emoji: '1030786210555248640',
            customid: 'null2',
            style: Discord.ButtonStyle.Secondary,
            control: false
        },

        {
            emoji: '861253229726793728',
            reactemoji: '⬅️',
            customid: 'left',
            style: Discord.ButtonStyle.Primary,
            control: true
        },

        {
            emoji: '1030784552081293383',
            reactemoji: '⬇️',
            customid: 'down',
            style: Discord.ButtonStyle.Primary,
            control: true
        },

        {
            emoji: '861253229798621205',
            reactemoji: '➡️',
            customid: 'right',
            style: Discord.ButtonStyle.Primary,
            control: true
        }
    ]

    var components = []
    var chunkButtonData = chunkArray(buttonsData, 3)

    chunkButtonData.forEach(buttonsData => {
        var buttonRow = new Discord.ActionRowBuilder()
        var buttons = []

        buttonsData.forEach(bdata => {
            var button = new Discord.ButtonBuilder()
                .setStyle(bdata.style)
                .setEmoji(bdata.emoji)
                .setCustomId(bdata.customid)

            buttons.push(button)
        })

        buttonRow.addComponents(buttons)

        components.push(buttonRow)
    })

    var rainmaze = new Rainmaze(w, h)
    var raindraw = rainmaze.draw()
    var rainObject = {}
    var allowedMentions
    var tag

    if (config.textEmbeds) rainObject.content = `${raindraw.description}\n\n${raindraw.fields.map(f => `**${f.name}** - ${f.value}`).join('\n')}`
    else rainObject.embeds = [raindraw]

    if (!config.useReactions) rainObject.components = components

    if (typeof (who) != 'string') {
        allowedMentions = {
            parse: (!who.permissions.has('Administrator') &&
                !who.permissions.has('MentionEveryone') &&
                who.id !== channel.guild.ownerID) ?
                ['users'] : ['users', 'everyone', 'roles']
        }
        rainObject.allowedMentions = allowedMentions
        tag = who.tag ?? who.user.tag
        who = who.id
    }

    var rainMsg = await (reply ?? channel)[reply ? 'reply' : 'send'](rainObject).catch(() => { })
    var ended = false

    if (!rainMsg) throw new Error(`Couldn't send Rainmaze to channel`)

    async function updateMaze() {
        raindraw = rainmaze.draw()

        if (ended) {
            if (config.useReactions) rainMsg.reactions.removeAll().catch(() => { })
            else rainObject.components = []

            if (ended == 'win') {
                var reward = randomNumber(w * h, w * h * 2)
                raindraw.fields.push({
                    name: "Reward",
                    value: `+${reward} P$`
                })
                data.userData[who]['bucks'] += reward

                data.botData.leaderboard[who] = {
                    tag: tag ?? (await bot.users.fetch(who).catch(() => { }))?.tag,
                    bucks: data.userData[who]['bucks']
                }
            }
        }

        if (config.textEmbeds) rainObject.content = `${raindraw.description}\n\n${raindraw.fields.map(f => `**${f.name}** - ${f.value}`).join('\n')}`
        else rainObject.embeds = [raindraw]

        rainMsg.edit(rainObject).catch(() => { })
    }

    if (config.useReactions) {
        var collector = rainMsg.createReactionCollector({ time: 60_000 })

        collector.on('collect', async (reaction, user) => {
            dmSupport(reaction)

            if (!(user.id === who && ((user.id !== bot.user.id && !user.bot) || config.allowbotusage))) {
                return
            }

            var buttonData = buttonsData.find(bdata => bdata.reactemoji == reaction.emoji.name)

            if (buttonData) {
                collector.resetTimer()

                reaction.users.remove(user).catch(() => { })

                if (buttonData.control) {
                    rainmaze.move(buttonData.customid)
                    if (rainmaze.won) {
                        collector.stop('win')
                        return
                    }

                    await updateMaze().catch(() => { })
                }
            }
        })

        collector.on('end', async (_, reason) => {
            ended = reason
            await updateMaze().catch(() => { })
        })

        for (var i in buttonsData) {
            var bdata = buttonsData[i]
            await rainMsg.react(bdata.reactemoji).catch(() => { })
        }
    } else {
        var collector = rainMsg.createMessageComponentCollector({ time: 60_000 })

        collector.on('collect', async (button) => {
            dmSupport(button)

            if (!(button.user.id === who && ((button.user.id !== bot.user.id && !button.user.bot) || config.allowbotusage))) {
                button.deferUpdate().catch(() => { })
                return
            }

            var buttonData = buttonsData.find(bdata => bdata.customid == button.customId)

            if (buttonData) {
                collector.resetTimer()
                button.deferUpdate().catch(() => { })

                if (buttonData.control) {
                    rainmaze.move(buttonData.customid)
                    if (rainmaze.won) {
                        collector.stop('win')
                        return
                    }

                    await updateMaze().catch(() => { })
                }
            }
        })

        collector.on('end', async (_, reason) => {
            ended = reason
            await updateMaze().catch(() => { })
        })
    }

    return raindraw.description
}

functions.displayShop = async function (channel, who, reply, type) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let data = poopy.data
    let { chunkArray, dmSupport, getLevel } = poopy.functions
    let { Discord } = poopy.modules

    var buttonsData = [
        /*{
            health: 100,
            maxHealth: 100,
            defense: 0,
            attack: 0,
            accuracy: 0,
            loot: 0,
            exp: 150,
            bucks: 20
        },*/

        {
            emoji: '❤',
            customid: 'health',
            style: Discord.ButtonStyle.Primary,
            desc: 'Upgrade your maximum health.',
            oprice: 80
        },

        {
            emoji: '🛡',
            customid: 'defense',
            style: Discord.ButtonStyle.Primary,
            desc: 'Increase your defense against attacks.',
            oprice: 120
        },

        {
            emoji: '⚔',
            customid: 'attack',
            style: Discord.ButtonStyle.Primary,
            desc: 'Increase your attack damage.',
            oprice: 120
        },

        {
            emoji: '🎯',
            customid: 'accuracy',
            style: Discord.ButtonStyle.Primary,
            desc: 'Increase the accuracy of each attack.',
            oprice: 150
        },

        {
            emoji: '🪙',
            customid: 'loot',
            style: Discord.ButtonStyle.Primary,
            desc: 'Get more loot while fighting someone.',
            oprice: 150
        }
    ]

    var shopObject = {}
    var allowedMentions
    var upgradeList
    var ended = false

    if (typeof (who) != 'string') {
        allowedMentions = {
            parse: (!who.permissions.has('Administrator') &&
                !who.permissions.has('MentionEveryone') &&
                who.id !== channel.guild.ownerID) ?
                ['users'] : ['users', 'everyone', 'roles']
        }
        shopObject.allowedMentions = allowedMentions
        who = who.id
    }

    async function updateShop() {
        buttonsData.forEach(upgrade => {
            upgrade.price = upgrade.oprice * (data.userData[who][upgrade.customid] + 1)
        })

        var components = []
        var chunkButtonData = chunkArray(buttonsData, 5)

        var level = getLevel(data.userData[who]['exp'])
        var cap = level >= 20 ? 25 :
            level >= 10 ? 10 :
                5

        chunkButtonData.forEach(buttonsData => {
            var buttonRow = new Discord.ActionRowBuilder()
            var buttons = []

            buttonsData.forEach(bdata => {
                var button = new Discord.ButtonBuilder()
                    .setStyle(bdata.style)
                    .setEmoji(bdata.emoji)
                    .setLabel(data.userData[who][bdata.customid] >= cap ? `MAX` : `${bdata.price} P$`)
                    .setCustomId(bdata.customid)

                buttons.push(button)
            })

            buttonRow.addComponents(buttons)

            components.push(buttonRow)
        })

        upgradeList = buttonsData.map(u => `${u.emoji} **${data.userData[who][u.customid] >= cap ? `MAX` : `${u.price} P$`}** - ${u.desc} **(${data.userData[who][u.customid]}/${cap})**`).join('\n')

        if (config.textEmbeds) shopObject.content = upgradeList
        else shopObject.embeds = [{
            title: `${type.toCapperCase()} Shop`,
            description: upgradeList,
            color: 0x472604,
            footer: {
                icon_url: bot.user.displayAvatarURL({
                    dynamic: true, size: 1024, extension: 'png'
                }),
                text: bot.user.username
            },
        }]

        if (ended) {
            if (config.useReactions) shopMsg.reactions.removeAll().catch(() => { })
            else shopObject.components = []
        } else if (!config.useReactions) shopObject.components = components
    }

    await updateShop().catch(() => { })

    var shopMsg = await (reply ?? channel)[reply ? 'reply' : 'send'](shopObject).catch(() => { })

    if (!shopMsg) throw new Error(`Couldn't send shop to channel`)

    if (config.useReactions) {
        var collector = shopMsg.createReactionCollector({ time: 60_000 })

        collector.on('collect', async (reaction, user) => {
            dmSupport(reaction)

            if (!(user.id === who && ((user.id !== bot.user.id && !user.bot) || config.allowbotusage))) {
                return
            }

            var buttonData = buttonsData.find(bdata => bdata.emoji == reaction.emoji.name)

            if (buttonData) {
                collector.resetTimer()

                reaction.users.remove(user).catch(() => { })

                if (buttonData.price <= data.userData[who]['bucks']) {
                    data.userData[who]['bucks'] -= buttonData.price
                    await updateShop().catch(() => { })
                } else {
                    await channel.send('Not enough moners.').catch(() => { })
                }
            }
        })

        collector.on('end', async (_, reason) => {
            ended = reason
            await updateShop().catch(() => { })
        })

        for (var i in buttonsData) {
            var bdata = buttonsData[i]
            await shopMsg.react(bdata.emoji).catch(() => { })
        }
    } else {
        var collector = shopMsg.createMessageComponentCollector({ time: 60_000 })

        collector.on('collect', async (button) => {
            dmSupport(button)

            if (!(button.user.id === who && ((button.user.id !== bot.user.id && !button.user.bot) || config.allowbotusage))) {
                button.deferUpdate().catch(() => { })
                return
            }

            var buttonData = buttonsData.find(bdata => bdata.customid == button.customId)

            if (buttonData) {
                collector.resetTimer()

                if (buttonData.price <= data.userData[who]['bucks']) {
                    button.deferUpdate().catch(() => { })
                    data.userData[who]['bucks'] -= buttonData.price
                    await updateShop().catch(() => { })
                } else {
                    await button.deferReply({
                        content: 'Not enough moners.',
                        ephemeral: true
                    }).catch((e) => console.log(e))
                }
            }
        })

        collector.on('end', async (_, reason) => {
            ended = reason
            await updateShop().catch(() => { })
        })
    }

    return upgradeList
}

functions.correctUrl = async function (url) {
    let poopy = this
    let { infoPost, execPromise } = poopy.functions
    let { axios, cheerio } = poopy.modules

    if (url.match(/^https\:\/\/(www\.)?tenor\.com\/view/) && url.match(/\d+/g) && process.env.TENOR_KEY) {
        var ids = url.match(/\d+/g)
        var body = await axios(`https://g.tenor.com/v1/gifs?ids=${ids[ids.length - 1]}&key=${process.env.TENOR_KEY}`).catch(() => { })
        if (body && body.data.results.length) {
            infoPost(`Tenor URL detected`)
            return body.data.results[0].media[0].gif.url
        }
    } else if (url.match(/^https\:\/\/(www\.)?gyazo\.com/)) {
        var gifurl = url.replace(/^https\:\/\/(www\.)?gyazo\.com/, 'https://i.gyazo.com') + '.gif'
        var mp4url = url.replace(/^https\:\/\/(www\.)?gyazo\.com/, 'https://i.gyazo.com') + '.mp4'
        var pngurl = url.replace(/^https\:\/\/(www\.)?gyazo\.com/, 'https://i.gyazo.com') + '.png'
        var gyazourls = [gifurl, mp4url, pngurl]
        var gyazourl = undefined
        for (var i in gyazourls) {
            var url = gyazourls[i]
            var response = await axios({
                url: url,
                validateStatus: () => true
            }).catch(() => { })
            if (response && response.status >= 200 && response.status < 300) {
                gyazourl = url
                break
            }
        }
        if (gyazourl) {
            infoPost(`Gyazo URL detected`)
            return gyazourl
        }
    } else if (url.match(/^https\:\/\/(www\.)?imgur\.com/)) {
        var mp4url = url.replace(/^https\:\/\/(www\.)?imgur\.com/, 'https://i.imgur.com') + '.mp4'
        var pngurl = url.replace(/^https\:\/\/(www\.)?imgur\.com/, 'https://i.imgur.com') + '.png'
        var imgurls = [mp4url, pngurl]
        var imgurl = undefined
        for (var i in imgurls) {
            var url = imgurls[i]
            var response = await axios({
                url: url,
                validateStatus: () => true
            }).catch(() => { })
            if (response && response.status >= 200 && response.status < 300) {
                imgurl = url
                break
            }
        }
        if (imgurl) {
            infoPost(`Imgur URL detected`)
            return imgurl
        }
    } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(catalog|library|games)\//)) {
        async function getAudio(id) {
            return new Promise((resolve) => {
                axios.get(`https://www.roblox.com/library/${id}`).then(async (res) => {
                    var $ = cheerio.load(res.data)
                    var urls = $("#AssetThumbnail .MediaPlayerIcon")

                    if (urls.length > 0) {
                        resolve(urls[0].attribs['data-mediathumb-url'])
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        async function getTexture(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://assetdelivery.roblox.com/v1/assetId/${id}`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data
                    var rbxmurl = body.location

                    if (!rbxmurl) {
                        resolve()
                        return
                    }

                    axios(rbxmurl).then((rres) => {
                        var rbody = rres.data

                        var $ = cheerio.load(rbody)
                        var urls = $("url")
                        if (urls.length > 0) {
                            var imageasseturl = urls[0].children[0].data
                            var ids = imageasseturl.match(/\d+/g)
                            var id = ids[0]

                            axios({
                                method: 'GET',
                                url: `https://assetdelivery.roblox.com/v1/assetId/${id}`,
                                headers: {
                                    "Accept": "application/json"
                                }
                            }).then((ires) => {
                                var ibody = ires.data
                                var textureurl = ibody.location

                                if (!textureurl) {
                                    resolve()
                                    return
                                }

                                resolve(textureurl)
                            }).catch(() => resolve())
                            return
                        }

                        resolve()
                    }).catch(() => resolve())
                }).catch(() => resolve())
            })
        }

        async function getGame(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${id}&size=512x512&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getGame(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        async function getThumb(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/assets?assetIds=${id}&size=700x700&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getThumb(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        async function getAsset(id) {
            var info = await axios.get(`https://api.roblox.com/marketplace/productinfo?assetId=${id}`).catch(() => { })

            if (info) {
                if (info.AssetTypeId === 3) {
                    var audiourl = await getAudio(id).catch(() => { })

                    if (audiourl) {
                        infoPost(`Roblox audio URL detected`)
                        return audiourl
                    }
                } else if (info.AssetTypeId === 2 || info.AssetTypeId === 11 || info.AssetTypeId === 12 || info.AssetTypeId === 13) {
                    var imageurl = await getTexture(id).catch(() => { })

                    if (imageurl) {
                        infoPost(`Roblox image asset URL detected`)
                        return imageurl
                    }
                } else if (info.AssetTypeId === 9) {
                    var gameurl = await getGame(id).catch(() => { })

                    if (gameurl) {
                        infoPost(`Roblox game icon URL detected`)
                        return gameurl
                    }
                } else {
                    var asseturl = await getThumb(id).catch(() => { })

                    if (asseturl) {
                        infoPost(`Roblox asset URL detected`)
                        return asseturl
                    }
                }
            }
        }

        var ids = url.match(/\d+/g)
        if (ids.length) {
            var id = ids[0]
            var asseturl = await getAsset(id).catch(() => { })

            if (asseturl) return asseturl
        }
    } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(badges)\//)) {
        async function getBadge(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${id}&size=150x150&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getBadge(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        var ids = url.match(/\d+/g)
        if (ids.length) {
            var id = ids[0]
            var badgeurl = await getBadge(id).catch(() => { })

            if (badgeurl) {
                infoPost(`Roblox badge URL detected`)
                return badgeurl
            }
        }
    } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(bundles)\//)) {
        async function getBundle(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/bundles/thumbnails?bundleIds=${id}&size=420x420&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getBundle(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        var ids = url.match(/\d+/g)
        if (ids.length) {
            var id = ids[0]
            var bundleurl = await getBundle(id).catch(() => { })

            if (bundleurl) {
                infoPost(`Roblox bundle URL detected`)
                return bundleurl
            }
        }
    } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(game-pass)\//)) {
        async function getGamePass(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${id}&size=150x150&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getGamePass(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        var ids = url.match(/\d+/g)
        if (ids.length) {
            var id = ids[0]
            var gamepassurl = await getGamePass(id).catch(() => { })

            if (gamepassurl) {
                infoPost(`Roblox gamepass URL detected`)
                return gamepassurl
            }
        }
    } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(users)\//)) {
        async function getUser(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/users/avatar?userIds=${id}&size=720x720&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getUser(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        var ids = url.match(/\d+/g)
        if (ids.length) {
            var id = ids[0]
            var userurl = await getUser(id).catch(() => { })

            if (userurl) {
                infoPost(`Roblox avatar URL detected`)
                return userurl
            }
        }
    } else if (url.match(/^https\:\/\/(www\.)?roblox\.com\/(groups)\//)) {
        async function getGroup(id) {
            return new Promise((resolve) => {
                axios({
                    method: 'GET',
                    url: `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${id}&size=420x420&format=Png&isCircular=false`,
                    headers: {
                        "Accept": "application/json"
                    }
                }).then(async (res) => {
                    var body = res.data

                    if (body.data ? body.data.length > 0 : false) {
                        if (body.data[0].state === 'Pending') {
                            var url = await getGroup(id).catch(() => { })
                            resolve(url)
                            return
                        }

                        resolve(body.data[0].imageUrl)
                        return
                    }

                    resolve()
                }).catch(() => resolve())
            })
        }

        var ids = url.match(/\d+/g)
        if (ids.length) {
            var id = ids[0]
            var groupurl = await getGroup(id).catch(() => { })

            if (groupurl) {
                infoPost(`Roblox group icon URL detected`)
                return groupurl
            }
        }
    } else if (url.match(/^https\:\/\/((www|m)\.)?youtube\.com|^https\:\/\/(www\.)?youtu\.be/)) {
        var youtubeurl = await execPromise(`yt-dlp ${url} --format 18 --get-url`).catch(() => { })

        if (youtubeurl) {
            infoPost(`YouTube video URL detected`)
            return youtubeurl.trim()
        }
    } else if (url.match(/^https\:\/\/(www|on\.)?soundcloud\.com/)) {
        var soundcloudurl = await execPromise(`yt-dlp ${url} --get-url`).catch(() => { })

        if (soundcloudurl) {
            infoPost(`SoundCloud URL detected`)
            return soundcloudurl.trim()
        }
    } else if (url.match(/^https\:\/\/((www)\.)?(fx)?twitter\.com\/\w{4,15}\/status\/\d+/)) {
        async function getImageUrl(url) {
            var res = await axios.get(url)
            var $ = cheerio.load(res.data)
            var urls = $('div .AdaptiveMedia-photoContainer.js-adaptive-photo')

            if (urls.length > 0) return urls[0].attribs['data-image-url']
        }

        async function getGifUrl(url) {
            var twittergifurl = await execPromise(`yt-dlp ${url} --format http --get-url`).catch(() => { })

            return twittergifurl.trim()
        }

        async function getVidUrl(url) {
            var twittervidurl = await execPromise(`yt-dlp ${url} --get-url`).catch(() => { })

            return twittervidurl.trim()
        }

        var twittervidurl = await getVidUrl(url).catch(() => { })
        var twittergifurl = await getGifUrl(url).catch(() => { })
        var twitterimageurl = await getImageUrl(url).catch(() => { })

        if (twittervidurl) {
            infoPost(`Twitter video URL detected`)
            return twittervidurl
        }

        if (twittergifurl) {
            infoPost(`Twitter GIF URL detected`)
            return twittergifurl
        }

        if (twitterimageurl) {
            infoPost(`Twitter image URL detected`)
            return twitterimageurl
        }
    }

    return url
}

functions.getUrls = async function (msg, options = {}) {
    let poopy = this
    let bot = poopy.bot
    let data = poopy.data
    let tempfiles = poopy.tempfiles
    let json = poopy.json
    let vars = poopy.vars
    let { axios } = poopy.modules
    let { infoPost, correctUrl, addLastUrl, getUrls } = poopy.functions

    if (!msg) return []
    var string = (options.string ?? msg.content ?? '').replace(/"([\s\S]*?)"/g, '')
    var prefixFound = options.prefix ?? string.toLowerCase().includes(data.guildData[msg.guild.id]['prefix'].toLowerCase())
    var max = options.max ?? Infinity
    var urls = []
    var regexes = [
        {
            regexp: vars.emojiRegex,
            func: async function (emoji) {
                var codepoints = []
                for (var j = 0; j < [...emoji].length; j++) {
                    codepoints.push([...emoji][j].codePointAt().toString(16).padStart(4, '0'))
                }
                var emojiimage = json.emojiJSON.find(image => image.unicode === codepoints.join('-'))
                if (emojiimage) {
                    infoPost(`Emoji URL detected`)
                    return emojiimage.url
                }
            }
        },
        {
            regexp: /<a?:[a-zA-Z\d_]+?:\d+>/g,
            func: async function (demoji) {
                var demojiidmatch = demoji.match(/\d+/g)
                var demojiid = demojiidmatch[demojiidmatch.length - 1]
                var gifurl = `https://cdn.discordapp.com/emojis/${demojiid}.gif?size=1024`
                var pngurl = `https://cdn.discordapp.com/emojis/${demojiid}.png?size=1024`
                var demojiurls = [gifurl, pngurl]
                var demojiurl = undefined
                for (var i in demojiurls) {
                    var url = demojiurls[i]
                    var response = await axios({
                        url: url,
                        validateStatus: () => true
                    }).catch(() => { })
                    if (response && response.status >= 200 && response.status < 300) {
                        demojiurl = url
                        break
                    }
                }
                if (demojiurl) {
                    infoPost(`Server emoji URL detected`)
                    return demojiurl
                }
            }
        },
        {
            regexp: /\d{10,}/g,
            func: async function (id) {
                var user = await bot.users.fetch(id).catch(() => { })
                if (user) {
                    infoPost(`Discord avatar URL detected`)
                    return user.displayAvatarURL({ dynamic: true, size: 1024, extension: 'png' })
                }
            }
        },
        {
            regexp: /temp:[a-zA-Z0-9_-]{10}/g,
            func: async function (url) {
                var id = url.substring(5)
                var tempfile = tempfiles[id]

                if (tempfile) {
                    infoPost(`Tempfile detected`)
                    return options.tempdir ? `tempfiles/${config.database}/${tempfile.name}` : url
                }
            }
        },
        {
            regexp: vars.validUrl,
            func: async function (url) {
                var correctedurl = await correctUrl(url).catch(() => { }) ?? url

                if (correctedurl == url) infoPost(`Default URL detected`)

                return correctedurl
            }
        }
    ]

    if (!prefixFound) {
        regexes.splice(0, 3)
    }

    var urlregex = new RegExp(regexes.map(regex => `(${regex.regexp.source})`).join('|'), 'g')

    var matches = string.match(urlregex)
    if (matches) {
        var matchesr = matches.reverse()
        for (var i in matchesr) {
            var match = matchesr[i]
            var matched = []
            regexes.forEach(regex => {
                var m = match.match(regex.regexp)
                if (m) {
                    regex.length = m[0].length
                    matched.push(regex)
                }
            })
            matched.sort(function (a, b) {
                return b.length - a.length
            })
            var url = await matched[0].func(match).catch(() => { })
            if (url) {
                urls = [url].concat(urls)
            }
            if (urls.length >= max) break
        }
    }

    if (msg.embeds.length) {
        var embedsR = []
        msg.embeds.forEach(embed => {
            if ((options.update && embed.fetched) || embed.type != 'rich' || !embed.image || !embed.image.url) return
            embedsR.push(embed.image.url)
            if (options.update && !embed.fetched) embed.fetched = true
        })
        embedsR.reverse()
        for (var i in embedsR) {
            var embed = embedsR[i]
            urls = [embed].concat(urls)
            if (urls.length >= max) break
        }
    }

    if (msg.attachments.size) {
        var attachmentsR = []
        msg.attachments.forEach(attachment => {
            if (options.update && attachment.fetched) return
            attachmentsR.push(attachment.url)
            if (options.update && !attachment.fetched) attachment.fetched = true
        })
        attachmentsR.reverse()
        for (var i in attachmentsR) {
            var attachment = attachmentsR[i]
            urls = [attachment].concat(urls)
            if (urls.length >= max) break
        }
    }

    if (msg.stickers.size) {
        var stickersR = []
        msg.stickers.forEach(sticker => {
            if (options.update && sticker.fetched) return
            stickersR.push(`https://cdn.discordapp.com/stickers/${sticker.id}.png`)
            if (options.update && !sticker.fetched) sticker.fetched = true
        })
        stickersR.reverse()
        for (var i in stickersR) {
            var sticker = stickersR[i]
            urls = [sticker].concat(urls)
            if (urls.length >= max) break
        }
    }

    var reply = await msg.fetchReference().catch(() => { })
    if (reply && !options.replied && msg.author.id != bot.user.id && prefixFound) {
        urls = urls.concat(await getUrls(reply, {
            replied: true,
            max: max - urls.length,
            tempdir: options.tempdir
        }) ?? [])
    }

    if (options.update) {
        var urlsr = urls.reverse()
        for (var i in urlsr) {
            var url = urlsr[i]

            if (url) {
                addLastUrl(msg, url)
            }
        }
    }

    if (urls.length > 0) infoPost(`Found ${urls.length} URL${urls.length > 1 ? 's' : ''} in message`)

    return urls
}

functions.lastUrl = function (msg, i, tempdir, global) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let tempdata = poopy.tempdata
    let tempfiles = poopy.tempfiles
    let { lastUrl } = poopy.functions

    var urlsGlobal = !global &&
        tempdata[msg.author.id][msg.id]?.['lastUrls'] ||
        data.guildData[msg.guild.id]['channels'][msg.channel.id]['lastUrls']
    var urls = urlsGlobal.slice()
    var url = urls[i]

    if (url === undefined) return

    if (url === null) {
        urls.splice(i, 1)
        urlsGlobal.splice(i, 1)
        return lastUrl(msg, i, tempdir)
    }

    if (url.startsWith('temp:')) {
        var id = url.substring(5)
        var tempfile = tempfiles[id]
        if (!tempfile) {
            urls.splice(i, 1)
            urlsGlobal.splice(i, 1)
            return lastUrl(msg, i, tempdir)
        } else if (tempdir) {
            url = `tempfiles/${config.database}/${tempfile.name}`
        }
    }

    return url
}

functions.lastUrls = function (msg, tempdir, global) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let tempdata = poopy.tempdata
    let tempfiles = poopy.tempfiles

    var urlsGlobal = !global &&
        tempdata[msg.author.id][msg.id]?.['lastUrls'] ||
        data.guildData[msg.guild.id]['channels'][msg.channel.id]['lastUrls']
    var urls = urlsGlobal.slice()

    for (var i = 0; i < urls.length; i++) {
        var url = urls[i]

        if (url === undefined) continue

        if (url === null) {
            urls.splice(i, 1)
            urlsGlobal.splice(i, 1)
            i--
            continue
        }

        if (url.startsWith('temp:')) {
            var id = url.substring(5)
            var tempfile = tempfiles[id]
            if (!tempfile) {
                urls.splice(i, 1)
                urlsGlobal.splice(i, 1)
                i--
                continue
            } else if (tempdir) {
                urls[i] = `tempfiles/${config.database}/${tempfile.name}`
            }
        }
    }

    return urls
}

functions.addLastUrl = function (msg, url) {
    let poopy = this
    let data = poopy.data
    let tempdata = poopy.tempdata
    let { lastUrls } = poopy.functions

    if (!url) return

    if (tempdata[msg.author.id][msg.id]) {
        var lasturls = [url].concat(lastUrls(msg))
        lasturls.splice(100)
        tempdata[msg.author.id][msg.id]['lastUrls'] = lasturls
    }

    var lasturls = [url].concat(lastUrls(msg, false, true))
    lasturls.splice(100)
    data.guildData[msg.guild.id]['channels'][msg.channel.id]['lastUrls'] = lasturls
}

functions.rateLimit = async function (msg) {
    let poopy = this
    let config = poopy.config
    let tempdata = poopy.tempdata
    let { infoPost } = poopy.functions

    if (!process.env.CLOUDAMQP_URL) return false
    if (!tempdata[msg.author.id]) tempdata[msg.author.id] = {}

    tempdata[msg.author.id]['ratelimit'] = (tempdata[msg.author.id]['ratelimit'] ?? 0) + 1
    setTimeout(() => tempdata[msg.author.id]['ratelimit'] -= 1, 90000)

    if (tempdata[msg.author.id]['ratelimit'] >= config.rateLimit) {
        tempdata[msg.author.id]['ratelimits'] = (tempdata[msg.author.id]['ratelimits'] ?? 0.5) * 2
        var rateLimitTime = config.rateLimitTime * tempdata[msg.author.id]['ratelimits']
        setTimeout(() => tempdata[msg.author.id]['ratelimits'] -= 1, rateLimitTime * 2)

        await msg.reply(`you've been banned from using commands for ${rateLimitTime / 60000} minutes for crashing the file processor ${config.rateLimit * tempdata[msg.author.id]['ratelimits']} times LMAO!!!`).catch(() => { })
        infoPost(`${msg.author.id} was rate limited for ${rateLimitTime / 60000} minutes`).catch(() => { })
        tempdata[msg.author.id]['ratelimited'] = Date.now() + rateLimitTime
        setTimeout(() => delete tempdata[msg.author.id]['ratelimited'], rateLimitTime)
        return true
    }

    return false
}

functions.deleteMsgData = function (msg) {
    let poopy = this
    let tempdata = poopy.tempdata

    if (
        tempdata[msg.author.id] &&
        tempdata[msg.author.id][msg.id] &&
        (
            !tempdata[msg.author.id][msg.id]['keyexecuting'] ||
            tempdata[msg.author.id][msg.id]['keyexecuting'] <= 0
        )
    ) {
        delete tempdata[msg.author.id][msg.id]
    }
}

functions.dmSupport = function (msg) {
    let poopy = this
    let { Discord, DMGuild, Collection } = poopy.modules

    if (msg.channel?.type == Discord.ChannelType.DM && msg.channel?.recipients) msg.channel.type = Discord.ChannelType.GroupDM

    if (!msg.author && msg.user) msg.author = msg.user
    if (!msg.user && msg.author) msg.user = msg.author

    if (!msg.member && (msg.user || msg.author)) Object.defineProperty(msg, 'member', {
        value: (msg.user || msg.author),
        writable: true
    })

    if (!msg.guild && (msg.user || msg.author)) Object.defineProperty(msg, 'guild', {
        value: new DMGuild(msg),
        writable: true
    })

    if (msg.channel && !msg.channel.guild && (msg.user || msg.author)) Object.defineProperty(msg.channel, 'guild', {
        value: new DMGuild(msg),
        writable: true
    })

    if (!msg.fetchWebhook) msg.fetchWebhook = async () => { }

    if ((msg.user || msg.author) && !(msg.user || msg.author).permissions) (msg.user || msg.author).permissions = { has: () => true }
    if (msg.channel && !msg.channel.permissionsFor) msg.channel.permissionsFor = () => {
        return { has: () => true }
    }

    if (msg.channel && !msg.channel.fetchWebhooks) msg.channel.fetchWebhooks = async () => new Collection()
    if (msg.channel && !msg.channel.createWebhook) msg.channel.createWebhook = async () => { }
    if (msg.channel && !msg.channel.isDMBased) msg.channel.isDMBased = () => true
    if (msg.channel && !msg.channel.isTextBased) msg.channel.isTextBased = () => true
    if (msg.channel && !msg.channel.isThread) msg.channel.isThread = () => false
    if (msg.channel && !msg.channel.isVoiceBased) msg.channel.isVoiceBased = () => false

    if (msg.mentions) {
        if (!msg.mentions.members) Object.defineProperty(msg.mentions, 'members', {
            value: new Collection(msg.mentions.users ? msg.mentions.users.map(user => {
                if (!user.user) user.user = user
                return [user.id, user]
            }) : []),
            writable: true
        })

        if (!msg.mentions.users) Object.defineProperty(msg.mentions, 'users', {
            value: new Collection(msg.mentions.members ? msg.mentions.members.map(member => [member.user.id, member.user]) : []),
            writable: true
        })
    }

}

functions.getKeywordsFor = async function (string, msg, isBot, { extrakeys = {}, extrafuncs = {}, resetattempts = false, ownermode = false, declaredonly = false } = {}) {
    let poopy = this
    let config = poopy.config
    let special = poopy.special
    let data = poopy.data
    let tempdata = poopy.tempdata
    let globaldata = poopy.globaldata
    let { getKeyFunc, infoPost, equalValues, sleep } = poopy.functions

    if (!tempdata[msg.author.id]) {
        tempdata[msg.author.id] = {}
    }

    if (!tempdata[msg.author.id][msg.id]) {
        tempdata[msg.author.id][msg.id] = {}
    }

    if (!tempdata[msg.author.id][msg.id]['keyexecuting']) {
        tempdata[msg.author.id][msg.id]['keyexecuting'] = 0
    }
    tempdata[msg.author.id][msg.id]['keyexecuting']++

    try {
        var startTime = Date.now()
        var extradkeys = declaredonly ? { ...tempdata[msg.author.id]['keydeclared'] } : { ...extrakeys, ...tempdata[msg.author.id]['keydeclared'] }
        var extradfuncs = declaredonly ? { ...tempdata[msg.author.id]['funcdeclared'] } : { ...extrafuncs, ...tempdata[msg.author.id]['funcdeclared'] }
        var started = false

        if (tempdata[msg.author.id]['ratelimited'] || globaldata['shit'].find(id => id === msg.author.id)) {
            return string
        }

        var keydata

        while ((keydata = getKeyFunc(string, {
            extrakeys: extradkeys,
            extrafuncs: extradfuncs,
            declaredonly: declaredonly
        })) && tempdata[msg.author.id][msg.id]?.['return'] == undefined) {
            if (!started || !tempdata[msg.author.id][msg.id]) {
                if (!tempdata[msg.author.id][msg.id]) {
                    tempdata[msg.author.id][msg.id] = {}
                }

                if (!tempdata[msg.author.id][msg.id]['keyattempts']) {
                    tempdata[msg.author.id][msg.id]['keyattempts'] = 0
                }

                if (!tempdata[msg.author.id][msg.id]['keyexecuting']) {
                    tempdata[msg.author.id][msg.id]['keyexecuting'] = 0
                }

                if (!tempdata[msg.author.id][msg.id]['keywordsExecuted']) {
                    tempdata[msg.author.id][msg.id]['keywordsExecuted'] = []
                }

                if (!tempdata[msg.author.id]['arrays']) {
                    tempdata[msg.author.id]['arrays'] = {}
                }

                if (!tempdata[msg.author.id]['declared']) {
                    tempdata[msg.author.id]['declared'] = {}
                }

                if (!tempdata[msg.author.id]['keydeclared']) {
                    tempdata[msg.author.id]['keydeclared'] = {}
                }

                if (!tempdata[msg.author.id]['funcdeclared']) {
                    tempdata[msg.author.id]['funcdeclared'] = {}
                }

                started = true
            }

            if (tempdata[msg.author.id]['ratelimited'] || globaldata['shit'].find(id => id === msg.author.id)) {
                return string
            }

            if (tempdata[msg.author.id][msg.id]['keyattempts'] >= config.keyLimit) {
                infoPost(`Keyword attempts value exceeded`)
                return 'Keyword attempts value exceeded.'
            }

            var opts = {
                extrakeys: extradkeys,
                extrafuncs: extradfuncs,
                ownermode: ownermode
            }

            switch (keydata.type) {
                case 'key':
                    var keyName = keydata.match
                    var key = special.keys[keydata.match] || extradkeys[keydata.match]

                    if ((key.limit != undefined && equalValues(tempdata[msg.author.id][msg.id]['keywordsExecuted'], keyName) >= key.limit) ||
                        (key.cmdconnected && data.guildData[msg.guild.id]?.['disabled'].find(cmd => cmd.find(n => n === key.cmdconnected)))) {
                        string = string.replace(keydata.match, '')
                        break
                    }

                    tempdata[msg.author.id][msg.id]['keywordsExecuted'].push(keyName)

                    var change

                    try {
                        change = await key.func.call(poopy, msg, isBot, string, opts)
                    } catch (e) {
                        console.log(e)
                        change = ''
                    }

                    string = typeof (change) === 'object' && change[1] === true ? String(change[0]) : string.replace(keydata.match, String(change).replace(/\$&/g, '$\\&'))
                    tempdata[msg.author.id][msg.id]['keyattempts'] += !data.guildData[msg.guild.id]['chaos'] ? (key.attemptvalue ?? 1) : 0
                    break

                case 'func':
                    var [funcName, match] = keydata.match
                    var func = special.functions[funcName] || extradfuncs[funcName]
                    var m = match

                    if ((func.limit != undefined && equalValues(tempdata[msg.author.id][msg.id]['keywordsExecuted'], funcName) >= func.limit) ||
                        (func.cmdconnected && data.guildData[msg.guild.id]?.['disabled'].find(cmd => cmd.find(n => n === func.cmdconnected)))) {
                        string = string.replace(`${funcName}(${match})`, '')
                        break
                    }

                    tempdata[msg.author.id][msg.id]['keywordsExecuted'].push(funcName)

                    match = match.replace(/\\\)/g, ')')
                    if (!func.raw) {
                        string = string.replace(m, match)
                    }

                    var change

                    try {
                        change = await func.func.call(poopy, [funcName, match], msg, isBot, string, opts)
                    } catch (e) {
                        console.log(e)
                        change = ''
                    }

                    string = typeof (change) === 'object' && change[1] === true ? String(change[0]) : string.replace(`${funcName}(${match})`, String(change).replace(/\$&/g, '$\\&'))
                    tempdata[msg.author.id][msg.id]['keyattempts'] += !data.guildData[msg.guild.id]['chaos'] ? (func.attemptvalue ?? 1) : 0
                    break
            }

            extradkeys = declaredonly ? { ...tempdata[msg.author.id]['keydeclared'] } : { ...extrakeys, ...tempdata[msg.author.id]['keydeclared'] }
            extradfuncs = declaredonly ? { ...tempdata[msg.author.id]['funcdeclared'] } : { ...extrafuncs, ...tempdata[msg.author.id]['funcdeclared'] }

            await sleep()
        }

        if (resetattempts) {
            if (tempdata[msg.author.id][msg.id]['keywordsExecuted']) {
                if (tempdata[msg.author.id][msg.id]['keywordsExecuted'].length) {
                    infoPost(`Took ${(Date.now() - startTime) / 1000} seconds to execute keywords/functions: ${tempdata[msg.author.id][msg.id]['keywordsExecuted'].map(k => `\`${k}\``).join(', ')}`)
                }
                tempdata[msg.author.id][msg.id]['keywordsExecuted'] = []
            }
        }

        if (tempdata[msg.author.id][msg.id]['return'] != undefined) {
            string = tempdata[msg.author.id][msg.id]['return']
            delete tempdata[msg.author.id][msg.id]['return']
        }

        if (tempdata[msg.author.id][msg.id]['keyexecuting']) {
            tempdata[msg.author.id][msg.id]['keyexecuting']--
        }

        return string
    } catch (e) {
        if (tempdata[msg.author.id][msg.id]['keyexecuting']) {
            tempdata[msg.author.id][msg.id]['keyexecuting']--
        }

        console.log(e)
        throw e
    }
}

functions.getLevel = function (exp) {
    let poopy = this
    let vars = poopy.vars

    if (exp > Number.MAX_SAFE_INTEGER) exp = Number.MAX_SAFE_INTEGER

    let lastLevel = 0
    let level = 0
    while (exp >= vars.battleStats.exp * (lastLevel + 1)) {
        exp -= vars.battleStats.exp * (lastLevel + 1)
        lastLevel = level
        level++
    }

    return { level, exp, required: vars.battleStats.exp * (lastLevel + 1) }
}

functions.battle = async function (msg, subject, action, damage, chance) {
    let poopy = this
    let bot = poopy.bot
    let config = poopy.config
    let data = poopy.data
    let tempdata = poopy.tempdata
    let vars = poopy.vars
    let { Discord, fs } = poopy.modules
    let { getLevel, execPromise, randomNumber, randomChoice, validateFile, downloadFile, dataGather } = poopy.functions

    await msg.channel.sendTyping().catch(() => { })
    var attachment = msg.attachments.first()?.url
    var sticker = msg.stickers[0] && `https://cdn.discordapp.com/stickers/${msg.stickers[0].id}.png`

    if (!subject && !attachment && !sticker) {
        await msg.reply('What/who is the subject?!').catch(() => { })
        return;
    };

    subject = subject ?? attachment ?? sticker

    var member = await bot.users.fetch((subject.match(/\d+/) ?? [subject])[0]).catch(() => { })
    var guildMember = await msg.guild.members.fetch((subject.match(/\d+/) ?? [subject])[0]).catch(() => { })

    var yourData = data.userData[msg.author.id]

    var subjData = member && (
        data.userData[member.id] ||
        (
            data.userData[member.id] = !config.testing && process.env.MONGOOSE_URL && await dataGather.userData(config.database, member.id).catch(() => { }) || {}
        )
    )

    var fakeSubj = !member && !guildMember
    var fakeSubjData = fakeSubj && (
        tempdata[`fakeSubj${subject}`] ||
        (
            tempdata[`fakeSubj${subject}`] = { health: 100, maxHealth: 100, death: 0 }
        )
    )

    for (data of [[yourData, "you're"], [subjData, "they're"], [fakeSubjData, "it's"]]) {
        var battleData = data[0]
        var pronoun = data[1]

        if (battleData && battleData.death) {
            if (battleData.death - Date.now() > 0) {
                await msg.reply(`But ${pronoun} dead.`).catch(() => { })
                return
            } else {
                battleData.health = battleData.maxHealth
                delete battleData.death
            }
        }
    }

    let attacked = Math.random() < chance + (yourData.accuracy * 0.1)
    let critical = attacked && Math.random() < 0.1 + (yourData.accuracy * 0.05)
    let critmult = critical ? Math.floor(Math.random() * 3) + 2 : 1
    let died = false

    damage += Math.floor(Math.random() * (yourData.attack + 1)) * 2
    if (critical) damage *= critmult

    var exp = 0
    var reward = 0
    var lastLevel = getLevel(yourData.exp).level

    if (member && subjData) {
        for (var stat in vars.battleStats) {
            if (subjData[stat] === undefined) {
                subjData[stat] = vars.battleStats[stat]
            }
        }
        if (!subjData.battleSprites) subjData.battleSprites = {}
    }

    if (attacked) {
        if (member) {
            var power = Math.round((subjData.maxHealth + subjData.attack + subjData.defense + subjData.accuracy + subjData.loot) / 5 * 10) / 10

            damage = Math.max(Math.round(damage / (subjData.defense / 20 + 1) * 10) / 10, 1)
            subjData.health -= damage
            if (member.id != msg.author.id && guildMember) exp = Math.floor(Math.random() * subjData.maxHealth / 5) + subjData.maxHealth / 20 + (yourData.loot * 10) * critmult * (Math.pow(getLevel(subjData.exp).level, 2) / 50) * Math.round(1 / chance)

            if (subjData.health <= 0) {
                subjData.health = 0
                subjData.death = Date.now() + 30_000
                if (member.id != msg.author.id && guildMember) {
                    exp *= 50
                    reward = Math.floor(exp / 75 * power * (yourData.loot / 10 + 1))
                }
                died = true
            }

            yourData.exp += exp
            yourData.bucks += reward

            data.botData.leaderboard[msg.author.id] = {
                tag: msg.author.tag,
                bucks: yourData.bucks
            }
        } else if (fakeSubj) {
            fakeSubjData.health -= damage

            if (fakeSubjData.health <= 0) {
                fakeSubjData.health = 0
                fakeSubjData.death = Date.now() + 30_000
                died = true
            }
        }
    }

    var level = getLevel(yourData.exp).level
    var actions = []

    if (critical) actions.push('***CRITICAL HIT!***')
    actions.push(
        action
            .replace('{src}', msg.author.username)
            .replace('{trgt}', (member && member.username) ?? subject ?? 'this')
            .replace('{dmg}', damage)
    )
    if (died) actions.push('They have died.')
    if (level > lastLevel) actions.push(`You leveled UP!`)

    var stats = []

    if ((member && subjData) || (fakeSubj && fakeSubjData)) {
        stats.push({
            name: `${msg.author.username}'s Health`,
            value: `${yourData.health} HP`,
            inline: true
        })
        if (member ? member.id != msg.author.id : fakeSubj) stats.push({
            name: `${subjData ? member.username : subject}'s Health`,
            value: `${(subjData ? subjData : fakeSubjData).health} HP`,
            inline: true
        })
    }

    if (exp) {
        stats.push({
            name: "Experience",
            value: `+${exp} XP`,
            inline: true
        })
    }

    if (died && reward) {
        stats.push({
            name: "Reward",
            value: `+${reward} P$`,
            inline: true
        })
    }

    if (level > lastLevel) {
        stats.push({
            name: "Level",
            value: level,
            inline: true
        })
    }

    var payload = {
        embeds: [{
            description: attacked ? actions.join(' ') : 'You missed!',
            color: 0x472604,
            fields: stats,
            footer: {
                icon_url: bot.user.displayAvatarURL({
                    dynamic: true, size: 1024, extension: 'png'
                }),
                text: bot.user.username
            },
        }],
        content: `${attacked ? actions.join(' ') : 'You missed!'}${stats.length ? `\n\n${stats.map(s => `**${s.name}**: ${s.value}`).join('\n')}` : ''}`,
        allowedMentions: {
            parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
        }
    }

    var filepath
    if ((member && subjData) || (vars.validUrl.test(subject) && (await validateFile(subject).catch(() => { })))) {
        var avatar = member ? (subjData.battleSprites[died ? 'dead' : attacked ? 'hurt' : 'miss'] ?? member.displayAvatarURL({
            dynamic: true, size: 256, extension: 'png'
        })) : subject

        filepath = await downloadFile(avatar, 'avatar.png')

        var spazz = () => `+(random(t+${Math.floor(Math.random() * 1000)})*2-1)*(0.4-mod(t,0.4))*15`
        var bossX = () => `+cos(PI/2*((t+${i + 1}*0.4)/0.4))*10`
        var bossY = () => `+sin(PI*((t+${i + 1}*0.4)/0.4))*10`

        var attackPos = new Array(4).fill().map(() =>
            attacked ?
                [randomNumber(50, 150), randomNumber(25, 125)] :
                [randomChoice([randomNumber(0, 25), randomNumber(175, 200)]), randomChoice([randomNumber(0, 25), randomNumber(125, 150)])]
        )
        var attackOverlay = []
        var attackConcat = []
        var enemyConcat = []

        for (var i in attackPos) {
            i = Number(i)
            var pos = attackPos[i]
            var x = pos[0]
            var y = pos[1]

            attackOverlay.push(`${!attacked && i % 2 != 0 ? `[en${i}]hflip[enf${i}];` : ''}[2:v][en${!attacked && i % 2 != 0 ? 'f' : ''}${i}]overlay=x='(W-w)/2${attacked ? spazz() : bossX(i)}':y='(H-h)/2${attacked ? spazz() : bossY(i)}${died ? `+t*40+(40*${i})` : ''}':format=auto[shake${i}];[shake${i}][1:v]overlay=shortest=1:x=${x}-w/2:y=${y}-h/2:format=auto[attack${i}]`)
            attackConcat.push(`[attack${i}]`)
            enemyConcat.push(`[en${i}]`)
        }

        await execPromise(`ffmpeg -stream_loop -1 -i ${filepath}/avatar.png -i assets/image/${critical ? 'crit' : ''}attack.gif -stream_loop -1 -f lavfi -i "color=0x00000000:s=200x150,format=rgba" -filter_complex "[0:v]scale=100:100:force_original_aspect_ratio=decrease,split=${enemyConcat.length}${enemyConcat.join('')};${attackOverlay.join(';')};${attackConcat.join('')}concat=n=${attackConcat.length},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ultrafast -gifflags -offsetting ${filepath}/attack.gif`)

        if (fs.existsSync(`${filepath}/attack.gif`)) {
            payload.files = [new Discord.AttachmentBuilder(`${filepath}/attack.gif`)]
            payload.embeds[0].image = { url: 'attachment://attack.gif' }
        }
    }

    if (config.textEmbeds) delete payload.embeds
    else delete payload.content

    if (!msg.nosend) await msg.reply(payload).catch(() => { })

    if (filepath && fs.existsSync(filepath)) fs.rm(filepath, { force: true, recursive: true })

    return attacked ? actions.join(' ') : 'You missed!'
}

functions.userToken = function (id, token) {
    let poopy = this
    let data = poopy.data
    let { randomChoice, decrypt, randomKey } = poopy.functions

    var tokens = data.userData[id]['tokens'][token] ?? []
    var userTkn = randomChoice(tokens)

    return userTkn ? decrypt(userTkn) : randomKey(token)
}

functions.fetchImages = async function (query, bing, safe, id) {
    let poopy = this
    let { userToken } = poopy.functions
    let { axios, gis } = poopy.modules

    return new Promise(async (resolve) => {
        if (bing) {
            var options = {
                method: 'GET',
                url: 'https://bing-web-search1.p.rapidapi.com/search',
                params: { q: query, count: '100', safeSearch: safe ? 'Moderate' : 'Off' },
                headers: {
                    'X-BingApis-SDK': 'true',
                    'X-RapidAPI-Host': 'bing-web-search1.p.rapidapi.com',
                    'X-RapidAPI-Key': userToken(id, 'RAPIDAPI_KEY')
                }
            }

            var response = await axios(options).catch(() => { })

            if (!response) {
                resolve([])
                return
            }

            if (!(response.status >= 200 && response.status < 300)) {
                resolve([])
                return
            }

            console.log(response.data)

            var images = []
            var body = response.data

            if (body.value ? body.value.length > 0 : false) {
                images = body.value.map(result => result.contentUrl)
            }

            resolve(images)
        } else {
            gis({
                searchTerm: query,
                queryStringAddition: `&safe=${safe ? 'active' : 'images'}`
            }, async function (_, results) {
                var images = []

                for (var i in results) {
                    var result = results[i]
                    var url = result.url.replace(/\\u([a-z0-9]){4}/g, (match) => {
                        return String.fromCharCode(Number('0x' + match.substring(2, match.length)))
                    })

                    images.push(url)
                }

                resolve(images)
            })
        }
    })
}

functions.downloadFile = async function (url, filename, options) {
    let poopy = this
    let config = poopy.config
    let vars = poopy.vars
    let tempfiles = poopy.tempfiles
    let { infoPost, execPromise } = poopy.functions
    let { fs, axios } = poopy.modules

    url = url || ' '
    options = options || {}
    var filepath
    var ffmpegUsed = false

    if (options.filepath) {
        filepath = options.filepath
    } else {
        var currentcount = vars.filecount
        vars.filecount++
        fs.mkdirSync(`temp/${config.database}/file${currentcount}`)
        filepath = `temp/${config.database}/file${currentcount}`
    }

    async function ffmpeg() {
        ffmpegUsed = true
        infoPost(`Downloading file through FFmpeg with name \`${filename}\``)
        if (options.fileinfo) {
            await execPromise(`ffmpeg -i "${url}"${options.ffmpegstring ? ` ${options.ffmpegstring}` : options.fileinfo.shortext === 'gif' ? ` -filter_complex "[0:v]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -gifflags -offsetting` : options.fileinfo.shortext === 'png' ? ' -pix_fmt rgba' : options.fileinfo.shortext === 'mp4' ? ' -c:v libx264 -pix_fmt yuv420p' : options.fileinfo.shortext === 'mp3' ? ' -c:a libmp3lame' : ''} ${filepath}/${filename}`)
        } else {
            await execPromise(`ffmpeg -i "${url}"${options.ffmpegstring ? ` ${options.ffmpegstring}` : ''} ${filepath}/${filename}`)
        }
    }

    if (!options.buffer && url.startsWith('temp:')) {
        options.buffer = true
        url = fs.readFileSync(`tempfiles/${config.database}/${tempfiles[url.substring(5)].name}`)
    }

    if (options.buffer) {
        infoPost(`Downloading file through buffer with name \`${filename}\``)
        fs.writeFileSync(`${filepath}/${filename}`, url)
    } else if (((!(options.fileinfo) ? true : ((options.fileinfo.shortext === options.fileinfo.type.ext) && (options.fileinfo.shortpixfmt === options.fileinfo.info.pixfmt))) || options.http) && !(options.ffmpeg)) {
        infoPost(`Downloading file through URL with name \`${filename}\``)
        var response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer'
        }).catch(() => { })

        if (response) {
            fs.writeFileSync(`${filepath}/${filename}`, response.data)
        }
    } else {
        await ffmpeg()
    }

    if (options.convert && !ffmpegUsed) {
        await ffmpeg()
    }

    infoPost(`Successfully downloaded \`${filename}\` in \`${filepath}\``)

    return filepath
}

functions.sendFile = async function (msg, filepath, filename, extraOptions) {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let tempfiles = poopy.tempfiles
    let vars = poopy.vars
    let { validateFileFromPath, execPromise, infoPost, rateLimit, addLastUrl, generateId } = poopy.functions
    let { fs, Discord } = poopy.modules

    extraOptions = extraOptions || {}

    var returnUrl

    var prefix = data.guildData[msg.guild.id]['prefix']
    var args = msg.content.substring(prefix.toLowerCase().length).split(' ')

    extraOptions.catbox = extraOptions.catbox ?? args.includes('-catbox')
    extraOptions.nosend = extraOptions.nosend ?? msg.nosend ?? args.includes('-nosend')
    extraOptions.compress = extraOptions.compress ?? args.includes('-compress')

    if (extraOptions.compress) {
        var fileinfo = await validateFileFromPath(`${filepath}/${filename}`, 'very true').catch(() => { })

        if (!fileinfo) {
            await msg.reply('Couldn\'t send file.').catch(() => { })
            infoPost(`Couldn\'t send file`)
            await rateLimit(msg)

            if (extraOptions.keep ||
                filepath == undefined ||
                filepath.startsWith('tempfiles')) return

            fs.rm(filepath, { force: true, recursive: true })
            return
        }

        var size = fs.readFileSync(`${filepath}/${filename}`).length
        var tries = 1
        while (size > (8 * 1024 * 1024) && tries < 5) {
            fs.renameSync(`${filepath}/${filename}`, `${filepath}/compress_${filename}`)

            switch (fileinfo.shorttype) {
                case 'image':
                    await execPromise(`ffmpeg -i ${filepath}/compress_${filename} -vf "scale=iw*${7 / fileinfo.size / tries}:ih*${7 / fileinfo.size / tries}" ${filepath}/${filename}`)
                    break;

                case 'gif':
                    await execPromise(`ffmpeg -i ${filepath}/compress_${filename} -filter_complex "[0:v]scale=iw*${7 / fileinfo.size / tries}:ih*${7 / fileinfo.size / tries},split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -gifflags -offsetting ${filepath}/compress2_${filename}`)
                    await execPromise(`gifsicle -O3 --lossy=${Math.min(Math.max(Math.round(fileinfo.size * 10) * tries, 30), 200)} -o ${filepath}/${filename} ${filepath}/compress2_${filename}`)
                    fs.rmSync(`${filepath}/compress2_${filename}`)
                    break;

                case 'video':
                    await execPromise(`ffmpeg -i ${filepath}/compress_${filename} -vf "scale='ceil(iw*${7 / fileinfo.size / tries}/2)*2':'ceil(ih*${7 / fileinfo.size / tries}/2)*2'" ${tries > 1 ? `-crf ${Math.min(28 + 10 * tries, 51)} -b:v ${Math.round(128 / tries)}k -b:a ${Math.round(256 / tries)}k ` : ''}-preset veryslow ${filepath}/${filename}`)
                    break;

                case 'audio':
                    await execPromise(`ffmpeg -i ${filepath}/compress_${filename} -b:a ${Math.round(128 / tries)}k ${filepath}/${filename}`)
                    break;

                default:
                    fs.copyFileSync(`${filepath}/compress_${filename}`, `${filepath}/${filename}`)
                    tries = 5
                    break;
            }

            if (fs.existsSync(`${filepath}/${filename}`)) fs.rmSync(`${filepath}/compress_${filename}`)
            else {
                fs.renameSync(`${filepath}/compress_${filename}`, `${filepath}/${filename}`)
                break
            }
            size = fs.readFileSync(`${filepath}/${filename}`).length
            tries++
        }
    }

    var nameindex = args.indexOf('-filename')
    if (nameindex > -1 && args[nameindex + 1]) {
        extraOptions.name = args[nameindex + 1].replace(/[/\\?%*:|"<>]/g, '-').substring(0, 128)
    }

    try {
        fs.readFileSync(`${filepath}/${filename}`)
    } catch (_) {
        await msg.reply('Couldn\'t send file.').catch(() => { })
        infoPost(`Couldn\'t send file`)
        await rateLimit(msg)

        if (extraOptions.keep ||
            filepath == undefined ||
            filepath.startsWith('tempfiles')) return

        fs.rm(filepath, { force: true, recursive: true })
        return
    }

    if (extraOptions.name) {
        fs.renameSync(`${filepath}/${filename}`, `${filepath}/${extraOptions.name}`)
        filename = extraOptions.name
    }

    if (extraOptions.catbox) {
        infoPost(`Uploading file to catbox.moe`)
        var fileLink = await vars.Catbox.upload(`${filepath}/${filename}`).catch(() => { })
        if (fileLink) {
            var isUrl = vars.validUrl.test(fileLink)

            if (extraOptions.nosend) {
                if (isUrl) {
                    addLastUrl(msg, fileLink)
                } else {
                    await msg.reply(fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink).catch(() => { })
                    infoPost(`Couldn\'t upload catbox.moe file, reason:\n\`${fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink}\``)
                }
            } else {
                await msg.reply(fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink).catch(() => { })
                if (!isUrl) {
                    infoPost(`Couldn\'t upload catbox.moe file, reason:\n\`${fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink}\``)
                }
            }

            if (isUrl) returnUrl = fileLink
        } else {
            await msg.reply('Couldn\'t send file.').catch(() => { })
            infoPost(`Couldn\'t upload catbox.moe file`)
            await rateLimit(msg)
        }
    } else if (extraOptions.nosend) {
        infoPost(`Saving file temporarily`)

        var id = generateId(fs.readdirSync(`tempfiles/${config.database}`).map(file => {
            var name = file.split('.')
            if (name.length > 1) name = name.slice(0, name.length - 1)
            else name = name[0]
            return name
        }))

        var ext = filename.split('.')
        if (ext.length > 1) ext = `.${ext[ext.length - 1]}`
        else ext = ''

        fs.copyFileSync(`${filepath}/${filename}`, `tempfiles/${config.database}/${id}${ext}`)

        tempfiles[id] = {
            name: `${id}${ext}`,
            oname: filename,
            opath: filepath
        }

        addLastUrl(msg, `temp:${id}`)

        returnUrl = `temp:${id}`

        setTimeout(() => {
            fs.rmSync(`tempfiles/${config.database}/${id}${ext}`, { force: true, recursive: true })
            delete tempfiles[id]
        }, 600000)
    } else {
        infoPost(`Sending file to channel`)
        var sendObject = {
            files: [new Discord.AttachmentBuilder(`${filepath}/${filename}`)]
        }

        if (extraOptions.content) sendObject.content = extraOptions.content

        var fileMsg = await msg.reply(sendObject).catch(() => { })

        if (!fileMsg) {
            await msg.reply('The output file is too large, so I\'m uploading it to catbox.moe.').catch(() => { })
            infoPost(`Failed to send file to channel, uploading to catbox.moe`)
            var fileLink = await vars.Catbox.upload(`${filepath}/${filename}`).catch(() => { })
            if (fileLink) {
                var isUrl = vars.validUrl.test(fileLink)
                await msg.reply(fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink).catch(() => { })

                if (!isUrl) {
                    infoPost(`Couldn\'t upload catbox.moe file, reason:\n\`${fileLink.includes('retard') ? 'ok so what happened right here is i tried to upload a gif with a size bigger than 20 mb to catbox.moe but apparently you cant do it so uhhhhhh haha no link for you' : fileLink}\``)
                } else returnUrl = fileLink
            } else {
                await msg.reply('Couldn\'t send file.').catch(() => { })
                infoPost(`Couldn\'t upload catbox.moe file`)
                await rateLimit(msg)
            }
        } else returnUrl = fileMsg.attachments.first().url
    }

    if (extraOptions.keep ||
        filepath == undefined ||
        filepath.startsWith('tempfiles')) return returnUrl

    infoPost(`Deleting \`${filepath}/${filename}\` and its folder`)

    fs.rm(filepath, { force: true, recursive: true })
    return returnUrl
}

functions.validateFileFromPath = async function (path, exception, rejectMessages) {
    let poopy = this
    let config = poopy.config
    let vars = poopy.vars
    let { infoPost, execPromise } = poopy.functions
    let { fs, fileType } = poopy.modules

    return new Promise(async (resolve, reject) => {
        var rej = reject
        reject = function (val) {
            infoPost(`File can't be processed, reason:\n\`${val}\``)
            rej(val)
        }

        infoPost(`Validating file from path`)

        if ((process.memoryUsage().rss / 1024 / 1024) <= config.memLimit) {
            reject('No resources available.')
            return
        }

        if (!fs.existsSync(path)) {
            reject('File not found.')
            return
        }

        var type = await fileType.fromFile(path).catch(() => { })

        if (!type) {
            var body = fs.readFileSync(path).toString()
            type = { mime: body.match(/<[a-z][\s\S]*>([\s\S]*)<\/[a-z][\s\S]*>/g) ? 'text/html' : 'text/plain', ext: body.match(/<[a-z][\s\S]*>([\s\S]*)<\/[a-z][\s\S]*>/g) ? 'html' : 'plain' }
        }

        var info = {
            frames: 1,
            fps: '0/0',
            duration: 'N/A',
            aduration: 'N/A',
            width: 0,
            height: 0,
            audio: false,
            pixfmt: 'unk',
            size: 0,
            realsize: 0
        }
        var names = path.split('/')
        var limitObject = exception ? config.limitsexcept : config.limits
        var shorttype
        var shortext
        var shortpixfmt

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            shorttype = 'image'
            shortext = 'png'
            shortpixfmt = 'rgba'
        } else if (type.mime.startsWith('video')) {
            shorttype = 'video'
            shortext = 'mp4'
            shortpixfmt = 'yuv420p'
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            shorttype = 'gif'
            shortext = 'gif'
            shortpixfmt = 'bgra'
        } else if (type.mime.startsWith('audio')) {
            shorttype = 'audio'
            shortext = 'mp3'
            shortpixfmt = 'unk'
        } else {
            shorttype = type.mime.split('/')[0]
            shortext = type.ext
            shortpixfmt = 'unk'
        }

        var buffer = fs.readFileSync(path)

        info.size = buffer.length / 1048576
        info.realsize = buffer.length

        var json = await execPromise(`ffprobe -of json -show_streams -show_format ${path}`)
        if (json) {
            try {
                var jsoninfo = JSON.parse(json)
                if (jsoninfo["streams"]) {
                    var videoStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'video')
                    var audioStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'audio')

                    if ((type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video')) {
                        info.frames = videoStream["nb_frames"] || 0
                        info.fps = videoStream["r_frame_rate"] || '0/0'
                    }
                    if (type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                        info.audio = !!audioStream
                    }
                    if ((type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                        info.duration = (videoStream || audioStream)["duration"] || 0
                    }
                    if ((type.mime.startsWith('video') || type.mime.startsWith('audio')) && info.audio) {
                        info.aduration = audioStream["duration"] || 0
                    }
                    if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
                        info.width = videoStream["width"] || 0
                        info.height = videoStream["height"] || 0
                        info.pixfmt = videoStream["pix_fmt"] || 'unk'
                    }
                }
            } catch (_) { }
        }

        if (exception !== 'very true') {
            for (var paramName in info) {
                if (limitObject[paramName]) {
                    var param = info[paramName]
                    var rejectMessage = rejectMessages ? rejectMessages[paramName] : limitObject[paramName]['message']

                    if (param > limitObject[paramName][shorttype]) {
                        reject(rejectMessage.replace('{param}', limitObject[paramName][shorttype]))
                        return
                    }
                }
            }
        }

        infoPost(`File \`${names[names.length - 1]}\` was successfully validated`)

        resolve({
            type: type,
            shorttype: shorttype,
            shortext: shortext,
            shortpixfmt: shortpixfmt,
            name: names[names.length - 1],
            info: info,
            path: `data:${type.mime};base64,${buffer.toString('base64')}`,
            buffer: buffer
        })
    })
}

functions.validateFile = async function (url, exception, rejectMessages) {
    let poopy = this
    let config = poopy.config
    let vars = poopy.vars
    let tempfiles = poopy.tempfiles
    let { infoPost, execPromise, validateFileFromPath } = poopy.functions
    let { fileType, axios, whatwg } = poopy.modules

    return new Promise(async (resolve, reject) => {
        url = url || ' '
        var rej = reject
        reject = function (val) {
            infoPost(`File can't be processed, reason:\n\`${val}\``)
            rej(val)
        }

        infoPost(`Validating file from URL`)

        if ((process.memoryUsage().rss / 1024 / 1024) <= config.memLimit) {
            reject('No resources available.')
            return
        }

        if (url.startsWith('temp:')) {
            if (tempfiles[url.substring(5)]) await validateFileFromPath(`tempfiles/${config.database}/${tempfiles[url.substring(5)].name}`, exception, rejectMessages)
                .then(res => resolve(res))
                .catch(res => reject(res))
            else reject('Tempfile unavailable.')
            return
        }

        if (!vars.validUrl.test(url)) {
            await validateFileFromPath(url, exception, rejectMessages)
                .then(res => resolve(res))
                .catch(res => reject(res))
            return
        }

        var response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            validateStatus: () => true,
            maxBodyLength: 1024 * 1024 * 200,
            maxContentLength: 1024 * 1024 * 200
        }).catch((err) => {
            reject(err.message)
        })

        var bufferresponse = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            validateStatus: () => true,
            maxBodyLength: 1024 * 1024 * 200,
            maxContentLength: 1024 * 1024 * 200
        }).catch(() => { }) ?? { data: '' }

        if (!response) {
            return
        }

        if (!(response.status >= 200 && response.status < 300)) {
            reject(`${response.status} ${response.statusText}`)
            return
        }

        var headers = response.headers
        var type = await fileType.fromStream(response.data).catch(() => { })

        if (!type) {
            var contentType = headers['Content-Type'] || headers['content-type']
            var mime = contentType.match(/[^;]+/)
            type = { mime: mime[0], ext: mime[0].split('/')[1] }
        }

        var info = {
            frames: 1,
            fps: '0/0',
            duration: 'N/A',
            aduration: 'N/A',
            width: 0,
            height: 0,
            audio: false,
            pixfmt: 'unk',
            size: 0,
            realsize: 0
        }
        var limitObject = exception ? config.limitsexcept : config.limits
        var name
        var shorttype
        var shortext
        var shortpixfmt

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            shorttype = 'image'
            shortext = 'png'
            shortpixfmt = 'rgba'
        } else if (type.mime.startsWith('video')) {
            shorttype = 'video'
            shortext = 'mp4'
            shortpixfmt = 'yuv420p'
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            shorttype = 'gif'
            shortext = 'gif'
            shortpixfmt = 'bgra'
        } else if (type.mime.startsWith('audio')) {
            shorttype = 'audio'
            shortext = 'mp3'
            shortpixfmt = 'unk'
        } else {
            shorttype = type.mime.split('/')[0]
            shortext = type.ext
            shortpixfmt = 'unk'
        }

        var parsedurl = whatwg.parseURL(url)
        name = parsedurl.path[parsedurl.path.length - 1]
        var contentdisposition = headers['content-disposition']
        if (contentdisposition) {
            var filenameMatch = contentdisposition.match(/filename=".+"/)
            if (filenameMatch) {
                name = filenameMatch[0].substring(10, filenameMatch[0].length - 1)
            }
        }

        var contentLength = headers['content-length'] || headers['Content-Length']

        if (contentLength) {
            info.size = Number(contentLength) / 1048576
            info.realsize = Number(contentLength)
        } else {
            info.size = bufferresponse.data.length / 1048576
            info.realsize = bufferresponse.data.length
        }

        var json = await execPromise(`ffprobe -of json -show_streams -show_format "${url}"`).catch(() => { })
        if (json) {
            try {
                var jsoninfo = JSON.parse(json)
                if (jsoninfo["streams"]) {
                    var videoStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'video')
                    var audioStream = jsoninfo["streams"].find(stream => stream["codec_type"] === 'audio')

                    if ((type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video')) {
                        info.frames = videoStream["nb_frames"] || 0
                        info.fps = videoStream["r_frame_rate"] || '0/0'
                    }
                    if (type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                        info.audio = !!audioStream
                    }
                    if ((type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) || type.mime.startsWith('video') || type.mime.startsWith('audio')) {
                        info.duration = (videoStream || audioStream)["duration"] || 0
                    }
                    if ((type.mime.startsWith('video') || type.mime.startsWith('audio')) && info.audio) {
                        info.aduration = audioStream["duration"] || 0
                    }
                    if (type.mime.startsWith('image') || type.mime.startsWith('video')) {
                        info.width = videoStream["width"] || 0
                        info.height = videoStream["height"] || 0
                        info.pixfmt = videoStream["pix_fmt"] || 'unk'
                    }
                }
            } catch (_) { }
        }

        if (exception !== 'very true') {
            for (var paramName in info) {
                if (limitObject[paramName]) {
                    var param = info[paramName]
                    var rejectMessage = rejectMessages ? rejectMessages[paramName] : limitObject[paramName]['message']

                    if (param > limitObject[paramName][shorttype]) {
                        reject(rejectMessage.replace('{param}', limitObject[paramName][shorttype]))
                        return
                    }
                }
            }
        }

        infoPost(`File \`${name}\` was successfully validated`)

        resolve({
            type: type,
            shorttype: shorttype,
            shortext: shortext,
            shortpixfmt: shortpixfmt,
            name: name,
            info: info,
            path: url,
            buffer: bufferresponse.data
        })
    })
}

functions.changeStatus = function () {
    let poopy = this
    let bot = poopy.bot
    let vars = poopy.vars
    let config = poopy.config
    let json = poopy.json
    let { infoPost } = poopy.functions
    let { Discord } = poopy.modules

    if (bot && vars.statusChanges) {
        var choosenStatus = json.statusJSON[Math.floor(Math.random() * json.statusJSON.length)]
        infoPost(`Status changed to ${choosenStatus.type.toLowerCase()} ${((choosenStatus.type === "Competing" && 'in ') || (choosenStatus.type === "Listening" && 'to ') || '')}${choosenStatus.name}`)
        bot.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: choosenStatus['name'] + ` | ${config.globalPrefix}help`,
                    type: Discord.ActivityType[choosenStatus['type']],
                    url: 'https://www.youtube.com/watch?v=LDQO0ALm0gE',
                }
            ],
        })
    }
}

var saveQueued = []
var saveQueueRunning = false

functions.saveQueue = async function () {
    let poopy = this

    saveQueued.push(poopy)

    if (saveQueueRunning) return
    saveQueueRunning = true

    while (saveQueued.length) {
        for (var i = 0; i < saveQueued.length; i++) {
            let pooper = saveQueued[i]
            if (!pooper || !pooper.data || !pooper.globaldata) continue
            await pooper.functions.saveData()
            await functions.sleep(120000)
        }
    }
}

functions.saveData = async function () {
    let poopy = this
    let config = poopy.config
    let data = poopy.data
    let globaldata = poopy.globaldata
    let { infoPost, dataGather } = poopy.functions
    let { fs } = poopy.modules

    if (config.notSave || Object.keys(data).length <= 0 || Object.keys(globaldata).length <= 0) return

    infoPost(`Saving data`)

    if (config.testing || !process.env.MONGOOSE_URL) {
        fs.writeFileSync(`data/${config.database}.json`, JSON.stringify(data))
        fs.writeFileSync(`data/globaldata.json`, JSON.stringify(globaldata))
    } else {
        const dataObject = { data, globaldata }

        await dataGather.update(config.database, dataObject).catch(() => { })
    }

    infoPost(`Data saved`)
}

functions.updateSlashCommands = async function () {
    let poopy = this
    let bot = poopy.bot
    let rest = poopy.rest
    let arrays = poopy.arrays
    let { Discord } = poopy.modules

    var slashBuilders = Object.values(arrays.slashBuilders)
    await rest.put(Discord.Routes.applicationCommands(bot.user.id), { body: slashBuilders }).catch((e) => console.log(e))
}

functions.findCommand = function (name) {
    let poopy = this
    let commands = poopy.commands

    return commands.find(c => c.name.find(n => n === name) != undefined)
}

functions.waitMessageCooldown = async function () {
    let poopy = this
    let config = poopy.config
    let vars = poopy.vars

    if (config.msgcooldown <= 0) return

    var elapsed = Date.now() - vars.msgcooldown
    while (elapsed < config.msgcooldown) {
        await functions.sleep(config.msgcooldown - elapsed)
        elapsed = Date.now() - vars.msgcooldown
    }
}

functions.setMessageCooldown = async function (msg) {
    let poopy = this
    let vars = poopy.vars

    vars.msgcooldown = Date.now()
    return msg
}

functions.calculateHivemindStatus = async function (poopy) {
    let bot = poopy.bot

    if (!process.env.HIVEMIND_ID) return '';

    var cusage = process.cpuUsage()
    var cused = (cusage.user + cusage.system) / 1024 / 1024

    return `${bot.user.username} #${process.env.HIVEMIND_ID} is here.\n\nCPU: ${cused}`
}

functions.updateHivemindStatus = async function () {
    let poopy = this
    let bot = poopy.bot
    let vars = poopy.vars

    if (!process.env.HIVEMIND_ID) return;

    var hivemindGuildId = process.env.HIVEMIND_GUILD_ID ?? '834431435704107018'
    var hivemindChannelId = process.env.HIVEMIND_CHANNEL_ID ?? '1201074511118868520'
    var hivemindChannel = bot.guilds.cache.get(hivemindGuildId).channels.cache.get(hivemindChannelId)

    if (!vars.hivemindMessageId) {
        functions.calculateHivemindStatus(poopy).then(status => {
            hivemindChannel.send(status).then(message => {
                vars.hivemindMessageId = message.id
            }).catch((err) => { console.log(err) });
        }).catch((err) => { console.log(err) });

        return;
    }

    functions.calculateHivemindStatus(poopy).then(status => {
        hivemindChannel.messages.cache.get(vars.hivemindMessageId).edit(status).catch((err) => { console.log(err) })
    }).catch((err) => { console.log(err) });
    
    return;
}

functions.getTotalHivemindStatus = async function () {
    let poopy = this
    let bot = poopy.bot
    let vars = poopy.vars

    if (!process.env.HIVEMIND_ID) return;

    var hivemindGuildId = process.env.HIVEMIND_GUILD_ID ?? '834431435704107018'
    var hivemindChannelId = process.env.HIVEMIND_CHANNEL_ID ?? '1201074511118868520'
    var hivemindChannel = bot.guilds.cache.get(hivemindGuildId).channels.cache.get(hivemindChannelId)

    var status = [];

    await hivemindChannel.messages.fetch().then(messages => {
        messages.forEach(async (msg) =>  {
            if (!msg.author.bot) {
                await msg.delete().catch((err) => { console.log(err) });
            } else {

                if (!msg.editedTimestamp) {
                    var id = msg.content.match(/#[^ ]+/g)
                    if (!id) return
                    id = id[0].substring(1)

                    if (id == process.env.HIVEMIND_ID) {
                        await msg.delete().catch((err) => { console.log(err) });
                    }

                    return
                }
                if ((Date.now() - msg.editedTimestamp) > 20000 + 5000) {
                    var id = msg.content.match(/#[^ ]+/g)
                    if (!id) return
                    id = id[0].substring(1)

                    if (id == process.env.HIVEMIND_ID && (Date.now() - msg.editedTimestamp) > 60000) {
                        await msg.delete().catch((err) => { console.log(err) });
                    }
                    
                    return
                }

                var id = msg.content.match(/#[^ ]+/g)
                if (!id) return
                id = id[0].substring(1)

                var EpicFail = false

                status.forEach((item, i) => {
                    if (item.id == id) {
                        if (item.time > msg.createdTimestamp) {
                            EpicFail = true
                            return
                        } else {
                            status.splice(i, 1)
                        }
                    }
                })

                if (EpicFail) return;

                var cpu = msg.content.match(/CPU: [\d\.]+/g)
                if (!cpu) return
                cpu = Number(cpu[0].substring(5))

                status.push({id: id, cpu: cpu, time: msg.createdTimestamp});
            }
        })
    }).catch((err) => { console.log(err) });
    
    if (status.length > 0) {
        status.sort((a, b) => a.cpu - b.cpu)
    }

    return status;
}

module.exports = functions
