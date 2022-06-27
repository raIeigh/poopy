const fs = require('fs-extra')

function regexClean(str) {
    return str.replace(/[\\^$.|?*+()[{]/g, (match) => `\\${match}`)
}

function digitRegex(filename) {
    filename = regexClean(filename)

    var digregName = filename.replace(/%(0\d)?d/g, (dmatch) => {
        dmatch = dmatch.substring(1)
        if (dmatch.substring(0, dmatch.length - 1)) return `\\d{${dmatch.substring(1, dmatch.length - 1)}}`
        else return `\\d`
    })

    return new RegExp(digregName)
}

function dir_name(filedir) {
    var dirsplit = filedir.split('/')
    var name = dirsplit.splice(dirsplit.length - 1, 1)[0]
    var dir = dirsplit.join('/')

    return [dir, name]
}

module.exports = {
    inputs: {
        ffmpeg: (args) => {
            var inputs = {}

            for (var i in args) {
                var arg = args[i]

                if (arg == '-i') {
                    var file = args[Number(i) + 1]

                    if (file.startsWith('temp/')) {
                        var [dir, name] = dir_name(file)
                        var nameregex = digitRegex(name)

                        fs.readdirSync(dir).forEach(file => {
                            if (file.match(nameregex)) {
                                inputs[`${dir}/${file}`] = fs.readFileSync(`${dir}/${file}`).toString('base64')

                                if (file.endsWith('.txt')) {
                                    var txtfiles = fs.readFileSync(`${dir}/${file}`).toString().split('\n')

                                    txtfiles.forEach(txtfile => {
                                        if (txtfile.startsWith('file')) {
                                            var file = txtfile.substring(6, txtfile.length - 1)

                                            inputs[`${dir}/${file}`] = fs.readFileSync(`${dir}/${file}`).toString('base64')
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            }

            return inputs
        },

        ffprobe: (args) => {
            if (args[args.length - 1].includes('"')) return {}
            return {
                [args[args.length - 1]]: fs.readFileSync(args[args.length - 1]).toString('base64')
            }
        },

        magick: (args) => {
            var inputs = {}

            for (var i in args) {
                var file = args[i]

                if (file.startsWith('temp/')) {
                    var [dir, name] = dir_name(file)
                    var nameregex = digitRegex(name)

                    fs.readdirSync(dir).forEach(file => {
                        if (file.match(nameregex)) {
                            inputs[`${dir}/${file}`] = fs.readFileSync(`${dir}/${file}`).toString('base64')
                        }
                    })
                }
                else break
            }

            return inputs
        },

        gifsicle: (args) => {
            return {
                [args[args.length - 1]]: fs.readFileSync(args[args.length - 1]).toString('base64')
            }
        },

        gmic: (args) => {
            var inputs = {}

            for (var i in args) {
                var file = args[i]

                if (file.startsWith('temp/')) {
                    var [dir, name] = dir_name(file)
                    var nameregex = digitRegex(name)

                    fs.readdirSync(dir).forEach(file => {
                        if (file.match(nameregex)) {
                            inputs[`${dir}/${file}`] = fs.readFileSync(`${dir}/${file}`).toString('base64')
                        }
                    })
                }
                else break
            }

            return inputs
        }
    },

    outputs: {
        ffmpeg: (args) => args[args.length - 1],
        magick: (args) => args[args.length - 1],
        gifsicle: (args) => args[args.indexOf('-o') + 1],
        gmic: (args) => args[args.indexOf('output') + 1]
    },

    names: {
        gmic: 'python assets/gmic.py'
    }
}