module.exports = {
  helpf: '(phrase)',
  desc: 'Generates subsequent text from the phrase inside the function.',
  func: async function (matches) {
    let poopy = this
    let { axios, deepai } = poopy.modules

    var word = matches[1]
    var models = ['j1-jumbo', 'j1-grande', 'j1-large']

    for (var model of models) {
        var resp = await axios.request({
          url: 'https://api.ai21.com/studio/v1/j1-jumbo/complete',
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
    
    var resp = await deepai.callStandardApi("text-generator", {
      text: word,
    }).catch(() => { })

    if (resp) {
      return resp.output
    }

    return word
  },
  attemptvalue: 10,
  limit: 1,
  envRequired: ['AI21_KEY', 'DEEPAI_KEY']
}