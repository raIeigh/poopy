module.exports = {
  helpf: '(phrase | regexp)',
  desc: 'Returns the first index in the phrase that matches the RegExp.',
  func: function (matches) {
    let poopy = this
    let { splitKeyFunc } = poopy.functions

    function regexIndexOf(string, regex, startpos) {
      var indexOf = string.substring(startpos || 0).search(regex);
      return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }

    var word = matches[1]
    var split = splitKeyFunc(word, { args: 2 })
    var phrase = split[0] ?? ''
    var reg = split[1] ?? ''
    var regexp = new RegExp(reg, 'ig')
    return regexIndexOf(phrase, regexp)
  }
}