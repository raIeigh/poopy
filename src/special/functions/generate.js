module.exports = {
  helpf: '(phrase)',
  desc: 'Generates subsequent text from the phrase inside the function.',
  func: async function (matches, msg) {
    let poopy = this
    let { userToken } = poopy.functions
    let { axios } = poopy.modules

    var word = matches[1]
    var models = ['j2-ultra', 'j2-mid', 'j2-light']

    for (var model of models) {
        var resp = await axios({
          url: `https://api.ai21.com/studio/v1/${model}/complete`,
          method: 'POST',
          data: {
              prompt: word,
              numResults: 1,
              maxTokens: 65,
              temperature: 0.6,
              topKReturn: 0,
              topP: 1,
              presencePenalty: {
                  scale: 0,
                  applyToNumbers: false,
                  applyToPunctuations: false,
                  applyToStopwords: false,
                  applyToWhitespaces: false,
                  applyToEmojis: false
              },
              countPenalty: {
                  scale: 0,
                  applyToNumbers: false,
                  applyToPunctuations: false,
                  applyToStopwords: false,
                  applyToWhitespaces: false,
                  applyToEmojis: false
              },
              frequencyPenalty: {
                  scale: 0,
                  applyToNumbers: false,
                  applyToPunctuations: false,
                  applyToStopwords: false,
                  applyToWhitespaces: false,
                  applyToEmojis: false
              },
              stopSequences: []
          },
          headers: {
              Authorization: `Bearer ${userToken(msg.author.id, 'AI21_KEY')}`
          }
      }).catch(() => { })

      if (resp) {
        return `${word}${resp.data.completions[0].data.text}`
      }
    }
  },
  attemptvalue: 10,
  limit: 1,
  envRequired: ['AI21_KEY']
}