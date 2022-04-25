module.exports = {
    desc: 'Returns a random insult.', func: async () => {
        let poopy = this

        var insults = [
            'stupid',
            'bastard',
            'retard',
            'idiot',
            'buffoon',
            'moron',
            'lazy',
            'bad',
            'weak',
            'unkind',
            'dumb',
            'bitch',
            'worthless',
            'trash'
        ]

        return insults[Math.floor(Math.random() * insults.length)]
    }
}