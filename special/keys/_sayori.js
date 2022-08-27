module.exports = {
    desc: 'returns not sayori ai', func: function (msg) {
        let poopy = this
        let { generateSayori } = poopy.functions

        return generateSayori.call(poopy, msg).text.replace(/\@/g, '@‌')
    }
}