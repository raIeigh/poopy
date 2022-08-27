module.exports = {
    desc: 'returns not sayori ai', func: function (msg) {
        let poopy = this
        let { generateSayori } = poopy.functions

        return generateSayori(msg).text.replace(/\@/g, '@‌')
    }
}