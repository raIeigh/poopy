const fs = require('fs')

function objectsEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !objectsEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

function getArgs(args) {
    function getArgName(argname) {
        var argall = [argname]
        var argmultimatch = argname.match(/\(([\s\S]*?)\)/g) ?? []
        var argmulti = argmultimatch.map(multi => {
            return {
                rp: multi,
                rpc: multi.substring(1, multi.length - 1).split('/')
            }
        })

        if (argmulti.length > 0) {
            argall = []
            for (var argm of argmulti) {
                for (var rpc of argm.rpc) {
                    argall.push(argname.replace(argm.rp, rpc))
                }
            }
        }

        return argall
    }

    var argmatch = args.match(/((\([^(\\]*(?:\\[\S\s][^)\\]*)*\)|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|<[^<\\]*(?:\\[\S\s][^>\\]*)*>|\{[^\{\\]*(?:\\[\S\s][^}\\]*)*}|\[[^\[\\]*(?:\\[\S\s][^\]\\]*)*\]|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+))(\.\.\.)?/g)
    if (argmatch[0].includes('newpoopy')) argmatch.splice(0, 1)
    var argreq = {
        "<": true,
        "{": false,
        "[": false
    }
    var arglist = []

    var cmd = argmatch.splice(0, 1)[0].split('/')[0]

    for (var arg of argmatch) {
        var multiarg = false
        var specifarg = false

        if (arg[0] == '(') continue
        var origarg = arg
        if (arg[0].endsWith('...')) {
            multiarg = true
            arg = arg.substring(0, arg.length - 3)
        }
        if (arg[0] == '"') arg = arg.substring(1, arg.length - 1)
        var required = argreq[arg[0]]
        arg = arg.substring(1, arg.length - 1)
        var argsplit = arg.match(/(\([^(\\]*(?:\\[\S\s][^)\\]*)*\)|(?:\\\s|\S)+)/g)

        var argname = argsplit[0]
        if (multiarg) argname = argname.substring(0, argname.length - 1) + 's'
        if (argname[0] == '-') {
            specifarg = true
            argname = argname.substring(1)
        }
        for (var argm of getArgName(argname, multiarg)) {
            if (argm.includes('/')) console.log(cmd)
            arglist.push({
                name: argm,
                required,
                specifarg,
                orig: origarg
            })
        }
    }

    return arglist
}

var commands = []
var commandGroups = []

fs.readdirSync('cmds').forEach(category => {
    fs.readdirSync(`cmds/${category}`).forEach(name => {
        //let cmdraw = fs.readFileSync(`cmds/${category}/${name}`).toString()
        const cmd = require(`./cmds/${category}/${name}`)
        //if (cmd.noargchange) return

        //var group = commandGroups.find(group => group.cmds[0] == cmd.name[0])
        //if (group) group.args = cmd.args

        commands.push(cmd)

        //const args = getArgs(cmd.help.name)

        //const cmdrawsplit = cmdraw.split('\n')
        //const space = (cmdrawsplit[1].match(/\s+/) ?? ['    '])[0]
        //cmdrawsplit[2] = `${space}args: ${JSON.stringify(args)},`
        //cmdraw = cmdrawsplit.join('\n')
        //fs.writeFileSync(`cmds/${category}/${name}`, cmdraw)
    })
})

//fs.writeFileSync(`assets/json/commandGroups.json`, JSON.stringify(commandGroups))

commands.forEach(cmd => {
    var group = commandGroups.find(group => objectsEqual(group.args, cmd.args))
    if (!group) {
        group = {
            names: [],
            args: cmd.args
        }
        commandGroups.push(group)
    }

    group.names.push(cmd.name[0])
})

commandGroups.forEach(g => console.log(g))