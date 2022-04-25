module.exports = {
  helpf: '(phrase | regexp)',
  desc: 'Returns the first index in the phrase that matches the RegExp.',
  func: async function (matches) {
    let poopy = this

    function regexIndexOf(string, regex, startpos) {
      var indexOf = string.substring(startpos || 0).search(regex);
      return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }

    var word = matches[1]
    var split = poopy.functions.splitKeyFunc(word)
    var phrase = split[0] ?? ''
    var reg = split.slice(1).length ? split.slice(1).join('|') : ''
    var regexp = new RegExp(reg, 'ig')
    return regexIndexOf(phrase, regexp)
  }
}