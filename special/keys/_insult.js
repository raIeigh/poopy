module.exports = {
    desc: 'Returns a random insult.', func: function () {
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
            'unfunny',
            'trash',
            'dumbass',
            'asshole',
            'motherfucker',
            'communist',
            'jerk',
            'dunce',
            'dork',
            'jackass',
            'cretin',
            'dipshit',
            'cow',
            'fucker',
            'imbecile',
            'clown',
            'horny',
            'toxic',
            'pinhead',
            'twat',
            'wanker',
            'bimbo',
            'pig',
            'donkey',
            'dweeb',
            'freak',
            'honky',
            'nutter',
            'rat',
            'scumbag',
            'twit',
            'weirdo',
            'gay'
        ]

        return insults[Math.floor(Math.random() * insults.length)]
    }
}