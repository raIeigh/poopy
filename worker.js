let throng = require('throng');
let Queue = require("bull");
let os = require('os');
let fs = require('fs-extra')
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

function start() {
  // Connect to the named work queue
  let ffmpegQueue = new Queue('ffmpeg', REDIS_URL);

  ffmpegQueue.process(maxJobsPerWorker, async (job, done) => {
    // This is an example job that just slowly reports on progress
    // while doing no work. Replace this with your own job logic.
    await execPromise(`ffmpeg -y -i assets/babis.png -vf pseudocolor out.png`)

    job.progress(100)
    console.log(job)

    // A job can return values that will be stored in Redis as JSON
    // This return value is unused in this demo application.
    done(fs.readFileSync('out.png'))
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });