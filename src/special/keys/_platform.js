module.exports = {
    desc: 'Returns a random platform.', func: function () {
        let poopy = this

        var platforms = ['android', 'apple', 'windows', 'mac', 'linux', 'xbox', 'nintendo switch', 'nintendo 3ds', 'nintendo 2ds', 'psp', 'ps1', 'ps2', 'gamecube', 'ps3', 'ps4', 'ps5', 'wii', 'xbox 360', 'xbox one', 'gameboy', 'nintendo 64', 'sega genesis', 'wii u', 'vr', 'gameboy advance', 'nintendo nes']
        return platforms[Math.floor(Math.random() * platforms.length)]
    },
    array: ['android', 'apple', 'windows', 'mac', 'linux', 'xbox', 'nintendo switch', 'nintendo 3ds', 'nintendo 2ds', 'psp', 'ps1', 'ps2', 'gamecube', 'ps3', 'ps4', 'ps5', 'wii', 'xbox 360', 'xbox one', 'gameboy', 'nintendo 64', 'sega genesis', 'wii u', 'vr', 'gameboy advance', 'nintendo nes']
}