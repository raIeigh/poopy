let throng = require('throng');
let Queue = require("bull");
let os = require('os');
let fs = require('fs-extra');
let { exec, spawn } = require('child_process');

// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
let memLimit = 0;
let procs = [];

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 50;

if (!fs.existsSync('temp')) fs.mkdirSync('temp')

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

let processingTools = {
    ffmpeg: (args) => args[args.length - 1],
    magick: (args) => args[args.length - 1],
    gifsicle: (args) => args[args.indexOf('-o') + 1],
    gmic: (args) => args[args.indexOf('output') + 1]
}

let processingNames = {
    gmic: 'python assets/gmic.py'
}

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

function start() {
    let workQueue = new Queue('work', REDIS_URL);

    let downloadJob = async (job) => {
        var data = job.data

        var buffer = data.buffer
        var filename = data.filename
        var filepath = data.filepath

        mkdirs(filepath)

        fs.writeFileSync(`${filepath}/${filename}`, Buffer.from(buffer, 'base64'))

        return filepath
    }

    let execJob = async (job) => {
        const code = job.data.code
        if (!code) throw new Error('No code was provided!')
        let args = code.match(/("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^\/\\]*(?:\\[\S\s][^\/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g)
        let command = args.splice(0, 1)[0]
        let execCommand = processingNames[command] ?? command

        const execProc = await execPromise(`${execCommand} ${args}`)

        if (processingTools[command]) {
            var name = processingTools[command](args)
            var nameregex = digitRegex(name)
    
            var dirsplit = name.split('/')
            var dir = dirsplit.slice(0, dirsplit.length - 1).join('/')
            var files = {}
            
            fs.readdirSync(dir).forEach(file => {
                if (file.match(nameregex)) files[file] = fs.readFileSync(`${dir}/${file}`).toString('base64')
            })
            
            return { std: execProc, files: files }
        } else return { std: execProc }
    }

    let deleteJob = async (job) => {
        var data = job.data

        var filepath = options.filepath

        fs.rmSync(filepath, { force: true, recursive: true })

        return filepath
    }

    workQueue.process(maxJobsPerWorker, async (job) => {
        switch (job.data.type) {
            case 'download':
                return await downloadJob(job)
                break;

            case 'exec':
                return await execJob(job)
                break;

            case 'delete':
                return await deleteJob(job)
                break;
        }
    })
}

throng({ workers, start });