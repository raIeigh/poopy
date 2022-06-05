module.exports = {
    desc: 'returns not sayori ai', func: function (msg) {
        let poopy = this

        return poopy.functions.generateSayori.call(poopy, msg).text.replace(/\@/g, '@‌')
    }
}