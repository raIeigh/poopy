module.exports = {
    args: {
        ffmpeg: (args) => args[args.length - 1],
        magick: (args) => args[args.length - 1],
        gifsicle: (args) => args[args.indexOf('-o') + 1],
        gmic: (args) => args[args.indexOf('output') + 1]
    },
    
    names: {
        gmic: 'python assets/gmic.py'
    }
}