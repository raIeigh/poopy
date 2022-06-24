"use strict";

var splitGraphemes = require("../splitgraphemes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.measureText = measureText;
exports.measureTextHeight = measureTextHeight;

function measureText(font, text) {
  var lines = text.split('\n');
  var widthlist = [];

  for (var n = 0; n < lines.length; n++) {
    var line = lines[n]
    var chars = splitGraphemes(line)
    var x = 0;

    for (var i = 0; i < chars.length; i++) {
      var char = chars[i]
      var nextchar = chars[i + 1]

      if (char.type === 'discord' || char.type === 'image') {
        x += font.chars[char.type].xadvance
      } else {
        if (font.chars[char.grapheme]) {
          var kerning = font.kernings[char.grapheme] && font.kernings[char.grapheme][nextchar && nextchar.grapheme] ? font.kernings[char.grapheme][nextchar && nextchar.grapheme] : 0;
          x += (font.chars[char.grapheme].xadvance || 0) + kerning;
        } else {
          var unkkerning = font.kernings['?'] && font.kernings['?'][nextchar && nextchar.grapheme] ? font.kernings['?'][nextchar && nextchar.grapheme] : 0;
          x += ((font.chars['?'] ? font.chars['?']['xadvance'] : 0) || 0) + unkkerning;
        }
      }
    }

    widthlist.push(x)
  }

  widthlist.sort((a, b) => b - a)

  return widthlist[0];
}

function measureTextHeight(font, text, maxWidth = Infinity) {
  var lines = text.split('\n').map(line => line.split(' '));
  var textTotalHeight = font.common.lineHeight;

  for (var i = 0; i < lines.length; i++) {
    var words = lines[i];
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + (n > 0 ? ' ' : '') + words[n];
      var testWidth = measureText(font, testLine);

      if (testWidth > maxWidth && n > 0) {
        textTotalHeight += font.common.lineHeight;
        line = words[n];
      } else {
        line = testLine;
      }
    }

    if (i > 0) {
      textTotalHeight += font.common.lineHeight;
    }
  }

  return textTotalHeight;
}
//# sourceMappingURL=measure-text.js.map
