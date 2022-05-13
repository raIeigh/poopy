const { exec } = require('child_process')

function itContinues() {
    exec('node .', () => {
        itContinues()
    })
}

itContinues()