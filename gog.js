let fs = require('fs')
let pork = 0

fs.readdirSync('src/commands').forEach((category) => {
    fs.readdirSync(`src/commands/${category}`).forEach((name) => {
        var cmd = fs.readFileSync(`src/commands/${category}/${name}`)
        if (!cmd.includes('return await sendFile')) {
            console.log(name)
            pork++
        }
    })
})

console.log(pork)