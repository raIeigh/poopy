module.exports = {
    desc: 'hate', func: async function () {
        let poopy = this

        var members = [
            "sayori",
            "cain",
            "tss_crazed",
            "timprox",
            "maks",
            "lumin",
            "archerlolman",
            "icre8",
            "charleh",
            "nitra_dev",
            "rukifox",
            "euth"
        ]
        return members[Math.floor(Math.random() * members.length)]
    }
}