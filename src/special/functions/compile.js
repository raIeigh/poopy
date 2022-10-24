module.exports = {
  helpf: '(language | code)',
  desc: 'Compiles the code in the specified language using Wandbox. Only declared variables and functions can be used here (to prevent confusion with functions in that language)',
  func: async function (matches, msg, isBot, _, opts) {
    let poopy = this
    let { getKeywordsFor, splitKeyFunc } = poopy.functions
    let vars = poopy.vars
    let { axios } = poopy.modules

    var declopts = { ...opts }
    declopts.declaredonly = true
    var word = await getKeywordsFor(matches[1], msg, isBot, declopts).catch(() => { }) ?? ''

    var language

    var cl = -1
    var codeBlock = (word.match(/```[\s\S]+```/) ?? [])[0]
    if (codeBlock) {
      var codeLang = (codeBlock.match(/```[^\n\r]+[\n\r]/) ?? [])[0]
      if (codeLang) {
        cl = codeLang.length
        language = codeLang.substring(3).trim()
      }
    }

    if (cl <= -1) {
      var split = splitKeyFunc(word, { args: 2 })
      language = split[0]
      word = split[1]
    }

    if (language === undefined) return 'What is the programming language?!'

    if (codeBlock) word = word.substring(cl > -1 ? cl : 3, word.length - 3).trim()

    var langVersion

    if (vars.codelanguages) {
      var findLang = vars.codelanguages.find(lang => lang.templates[0] === language.toLowerCase())

      if (findLang) {
        langVersion = findLang.name
      } else {
        return 'Not a valid programming language.'
      }
    } else return word

    var response = await axios.request({
      url: 'https://wandbox.org/api/compile.ndjson',
      method: 'POST',
      data: {
        code: word,
        codes: [],
        compiler: langVersion,
        'compiler-option-raw': "",
        description: "",
        options: "",
        'runtime-option-raw': "",
        stdin: "",
        title: ""
      }
    }).catch(async () => { })

    if (!response) return word

    var jsons = response.data.trim().split('\n').map(json => JSON.parse(json))

    var stdOut = jsons.filter(json => json.type === 'StdOut').map(json => json.data)
    var stdErr = jsons.filter(json => json.type === 'StdErr').map(json => json.data)
    var output

    if (stdOut && stdErr) output = `StdOut: ${stdOut.join('\n')}\n\nStdErr: ${stdErr.join('\n')}`
    else output = (stdOut ?? stdErr) ? (stdOut ?? stdErr).join('\n') : ''

    return output.trim()
  },
  attemptvalue: 30,
  limit: 5,
  raw: true,
  parentheses: true
}