var data = {}

module.exports = {
    data() {
        return data
    },

    udata(func) {
        func(data)
    }
}