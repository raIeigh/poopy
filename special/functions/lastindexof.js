module.exports = {
    helpf: '(phrase | regexp)',
    desc: 'Returns the last index in the phrase that matches the RegExp.',
    func: function (matches) {
        let poopy = this
        let { splitKeyFunc } = poopy.functions

        function regexLastIndexOf(string, regex, startpos) {
            regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
            if (typeof (startpos) == "undefined") {
                startpos = string.length;
            } else if (startpos < 0) {
                startpos = 0;
            }
            var stringToWorkWith = string.substring(0, startpos + 1);
            var lastIndexOf = -1;
            var nextStop = 0;
            while ((result = regex.exec(stringToWorkWith)) != null) {
                lastIndexOf = result.index;
                regex.lastIndex = ++nextStop;
            }
            return lastIndexOf;
        }

        var word = matches[1]
        var split = splitKeyFunc(word)
        var phrase = split[0] ?? ''
        var reg = split.slice(1).length ? split.slice(1).join('|') : ''
        var regexp = new RegExp(reg, 'ig')
        return regexLastIndexOf(phrase, regexp)
    }
}