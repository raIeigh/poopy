module.exports = {
    name: ['name here'],
    args: [],
    execute: async function (msg, args) {
      // code here
        let poopy = this
        let { Discord } = poopy.modules
        
        return "hello worled"
    },
    help: {
        name: 'commandtemplate',
        value: 'Command Template for devs'
    },
    cooldown: 2500, // cooldown in ms
    type: 'Type'
}
