module.exports = {
    desc: 'hate', func: function () {
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
            "euth",
            "kirbo",
            "viper"
        ]
        return members[Math.floor(Math.random() * members.length)]
    }
}