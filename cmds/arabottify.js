module.exports = {
    name: ['arabottify'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        var wordNumber = Math.floor(Math.random() * 40) + 1
        var wordsSpecified = false
        var noextrawords = false
        var nopunctuation = false
        var wordindex = args.indexOf('-words')
        if (wordindex > -1) {
            wordNumber = isNaN(Number(args[wordindex + 1])) ? Math.floor(Math.random() * 40) + 1 : Number(args[wordindex + 1]) <= 1 ? 1 : Number(args[wordindex + 1]) >= 10000 ? 10000 : Math.round(Number(args[wordindex + 1])) || 1
            wordsSpecified = true
            args.splice(wordindex, 2)
        }
        if (args.find(arg => arg === '-noextrawords')) {
            noextrawords = true
            args.splice(args.indexOf('-noextrawords'), 1)
        }
        if (args.find(arg => arg === '-nopunctuation')) {
            nopunctuation = true
            args.splice(args.indexOf('-nopunctuation'), 1)
        }
        if (args[1] === undefined) {
            var arabArray = []
            var dict = 1
            var conn = 1
            for (var i = 0; i < wordNumber; i++) {
                var randomFactor = Math.floor(Math.random() * 8)
                if (randomFactor === 7) {
                    dict = 1
                    conn = 1
                    arabArray.push(msg.member.nickname || msg.author.username + (((Math.floor(Math.random() * 5) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''))
                } else {
                    function chooseWord() {
                        if (Math.floor(Math.random() * dict) + 1 === (dict === 3 ? 0 : 1)) {
                            conn = 1
                            dict++
                            arabArray.push(poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)] + (((Math.floor(Math.random() * 5) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''))
                        } else if (Math.floor(Math.random() * conn) + 1 === (conn === 3 ? 0 : 1)) {
                            dict = 1
                            conn++
                            arabArray.push(poopy.arrays.arabConnectors[Math.floor(Math.random() * poopy.arrays.arabConnectors.length)] + (((Math.floor(Math.random() * 5) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''))
                        } else {
                            chooseWord()
                        }
                    }

                    chooseWord()
                }
            }
            msg.channel.send({
                content: arabArray.join(' '),
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(async () => {
                var currentcount = poopy.vars.filecount
                poopy.vars.filecount++
                var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
                poopy.modules.fs.mkdirSync(`${filepath}`)
                poopy.modules.fs.writeFileSync(`${filepath}/arabottify.txt`, arabArray.join(' '))
                await msg.channel.send({
                    files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/arabottify.txt`)]
                }).catch(() => { })
                poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var arabArray = args.splice(1)
        var arabArray2 = []
        arabArray.forEach(word => {
            for (var i = 0; i < ((Math.floor(Math.random() * 5) === 1 && (noextrawords ? 1 : 2)) || 1); i++) {
                arabArray2.push({ word: word + (((Math.floor(Math.random() * 7) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''), randomness: Math.random() })
            }
            if (Math.floor(Math.random() * 4) === 3 && !noextrawords) {
                var randomFactor = Math.floor(Math.random() * 8)
                if (randomFactor === 7) {
                    arabArray2.push({ word: msg.member.nickname || msg.author.username + (((Math.floor(Math.random() * 7) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''), randomness: Math.random() })
                } else if (randomFactor >= 0 && randomFactor <= 3) {
                    arabArray2.push({ word: poopy.arrays.arabDictionary[Math.floor(Math.random() * poopy.arrays.arabDictionary.length)] + (((Math.floor(Math.random() * 7) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''), randomness: Math.random() })
                } else {
                    arabArray2.push({ word: poopy.arrays.arabConnectors[Math.floor(Math.random() * poopy.arrays.arabConnectors.length)] + (((Math.floor(Math.random() * 7) === 4 && !nopunctuation) && poopy.vars.punctuation[Math.floor(Math.random() * poopy.vars.punctuation.length)]) || ''), randomness: Math.random() })
                }
            }
        })
        arabArray2.sort(function (a, b) {
            return a.randomness - b.randomness
        })
        arabArray = []
        arabArray2.forEach(word => {
            arabArray.push(word.word)
        })
        if (wordsSpecified) {
            arabArray.splice(wordNumber)
        }
        msg.channel.send({
            content: arabArray.join(' '),
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(async () => {
            var currentcount = poopy.vars.filecount
            poopy.vars.filecount++
            var filepath = `temp/${poopy.config.mongodatabase}/file${currentcount}`
            poopy.modules.fs.mkdirSync(`${filepath}`)
            poopy.modules.fs.writeFileSync(`${filepath}/arabottify.txt`, arabArray.join(' '))
            await msg.channel.send({
                files: [new poopy.modules.Discord.MessageAttachment(`${filepath}/arabottify.txt`)]
            }).catch(() => { })
            poopy.modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
        msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'arabottify [message] [-words <wordNumber>] [-noextrawords] [-nopunctuation]',
        value: 'message. a Scramble BLACK. message. Scramble Poopy Extra words... included\n' +
            'Example usage: p:arabottify -words 1 -nopunctuation'
    },
    cooldown: 2500,
    type: 'Text'
}