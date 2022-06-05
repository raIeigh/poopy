module.exports = {
    desc: 'Returns your own nickname.', func: function (msg) {
        let poopy = this

        return msg.member ? (msg.member.nickname || msg.author.username) : msg.author.username
    }
}