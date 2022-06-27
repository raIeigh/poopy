let throng = require('throng')
let os = require('os')
let fs = require('fs-extra')
let { exec, spawn } = require('child_process')
let { getAllData, updateAllData } = require('./modules/dataGathering')

let testing = !__dirname.includes('app');
let memLimit = 0;
let procs = [];
let workers = process.env.WEB_CONCURRENCY || 2;
let datastores = {};
let globaldata;
let maxJobsPerWorker = 50;

if (!fs.existsSync('temp')) fs.mkdirSync('temp')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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

function mkdirs(filepath) {
    var folders = filepath.split('/')
    var levels = []

    folders.forEach(folder => {
        var dir = levels.length > 0 ?
            `${levels.join('/')}/${folder}` :
            folder

        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
        levels.push(folder)
    })
}

function dir_name(filedir) {
    var dirsplit = filedir.split('/')
    var name = dirsplit.splice(dirsplit.length - 1, 1)[0]
    var dir = dirsplit.join('/')

    return [dir, name]
}

let processingTools = require('./modules/processingTools')

function execPromise(code) {
    return new Promise((resolve) => {
        var args = code.match(/("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g)
        var command = args.splice(0, 1)[0]

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
            if ((rss / 1024 / 1024) <= memLimit) {
                if (os.platform() == 'win32') exec(`taskkill /pid ${proc.pid} /f /t`)
                else exec(`kill -9 ${proc.pid}`) //proc.kill('SIGKILL')
            }
        }, 1000)

        function handleExit() {
            if (!stdoutclosed || !stderrclosed || !procExited) return
            var fproc = procs.findIndex(p => p === proc)
            if (fproc > -1) procs.splice(fproc, 1)
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

        procs.push(proc)
    })
}

async function master() {
    console.log('master started')

    let workQueue = require('./modules/createQueue')('work');

    var jobs = await workQueue.getJobs('active').catch(() => { })

    for (var job of (jobs ?? [])) {
        await job.moveToFailed('Stalled jobs clean').catch(() => { })
    }

    await sleep(5000)

    await workQueue.obliterate({ force: true }).catch(() => { })

    workQueue.close()
}

async function start(id) {
    let workQueue = require('./modules/createQueue')('work');

    let getDataJob = async (job) => {
        var data = job.data

        var mongodatabase = data.mongodatabase
        var global = data.global

        var returndata = {}

        if (datastores[mongodatabase]) {
            returndata.data = datastores[mongodatabase]

            if (global && globaldata) returndata.globaldata = globaldata

            return returndata
        }

        /*returndata = await getAllData(mongodatabase, global)

        if (returndata.data) datastores[mongodatabase] = returndata.data
        if (returndata.globaldata) globaldata = returndata.globaldata

        return returndata*/
    }

    let saveDataJob = async (job) => {
        var data = job.data

        var mongodatabase = data.mongodatabase
        var data = data.data

        if (data.data) datastores[mongodatabase] = returndata.data
        if (data.globaldata) globaldata = returndata.globaldata
    }

    let execJob = async (job) => {
        let data = job.data

        let code = data.code
        if (!code) throw new Error('No code was provided!')

        let args = code.split(' ')
        let command = args[0]

        let delfolder

        for (let inpdir in (data.files ?? {})) {
            let [idir] = dir_name(inpdir)

            mkdirs(idir)

            fs.writeFileSync(inpdir, Buffer.from(data.files[inpdir], 'base64'))

            if (!delfolder) delfolder = idir.split('/').slice(0, 3).join('/')
        }

        let filedir = processingTools.outputs[command] &&
            processingTools.outputs[command](args)
        let dir, name
        let nameregex

        if (filedir) {
            [dir, name] = dir_name(filedir)
            if (command == 'gmic' && args.includes('morph')) {
                var namesplit = name.split('.')
                name = `${namesplit.slice(0, namesplit.length - 1).join('.')}_%06d.${namesplit[namesplit.length - 1]}`
            }

            nameregex = digitRegex(name)

            mkdirs(dir)

            if (!delfolder) delfolder = dir.split('/').slice(0, 3).join('/')
        }

        let exargs = args.slice()
        let excommand = exargs[0]
        excommand = exargs[0] = processingTools.names[exargs[0]] ?? exargs[0]
        code = exargs.join(' ')

        const execProc = await execPromise(code)

        let output = {
            std: execProc
        }

        if (dir && nameregex) {
            output.files = {}

            fs.readdirSync(dir).forEach(file => {
                if (file.match(nameregex)) output.files[file] = fs.readFileSync(`${dir}/${file}`).toString('base64')
            })
        }

        if (delfolder) fs.rmSync(delfolder, { force: true, recursive: true })

        return output
    }

    workQueue.process(maxJobsPerWorker, async (job) => {
        switch (job.data.type) {
            case 'dataget':
                return await getDataJob(job);

            case 'datasave':
                await saveDataJob(job);
                break;

            case 'exec':
                return await execJob(job);

            case 'eval':
                try {
                    return { value: eval(job.data.code) }
                } catch (err) {
                    throw { err: err.stack }
                };
        }
    })

    console.log(`worker ${id} started`)
}

throng({ workers, master, start });