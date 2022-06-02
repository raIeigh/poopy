// Markov Model from https://www.soliantconsulting.com/blog/2013/02/title-generator-using-markov-chains

module.exports = function (phrases) {
    var markovTerminals = {};
    var markovStartWords = [];
    var markovWordStats = {};

    var markovTrain = function (words) {
        markovTerminals[words[words.length - 1]] = true;
        markovStartWords.push(words[0]);
        for (var j = 0; j < words.length - 1; j++) {
            if (markovWordStats.hasOwnProperty(words[j])) {
                markovWordStats[words[j]].push(words[j + 1]);
            } else {
                markovWordStats[words[j]] = [words[j + 1]];
            }
        }
    };

    var markovWordChoice = function (a) {
        var i = Math.floor(a.length * Math.random());
        return a[i];
    };

    var markovMakeSentence = function (min_length) {
        word = markovWordChoice(markovStartWords);
        var sentence = [word];
        while (markovWordStats.hasOwnProperty(word)) {
            var next_words = markovWordStats[word];
            word = markovWordChoice(next_words);
            sentence.push(word);
            if (sentence.length > min_length && markovTerminals.hasOwnProperty(word)) {
                break;
            };
        }
        if (sentence.length < min_length && Math.random() > 0.2) {
            return markovMakeSentence(min_length)
        };
        return sentence.join(' ');
    };

    if (phrases) phrases.forEach(phrase => markovTrain(phrase.split(' ')));
    return markovMakeSentence(5);
}