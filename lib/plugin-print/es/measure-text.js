"use strict";

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
    var x = 0;

    for (var i = 0; i < line.length; i++) {
      if (font.chars[line[i]]) {
        var kerning = font.kernings[line[i]] && font.kernings[line[i]][line[i + 1]] ? font.kernings[line[i]][line[i + 1]] : 0;
        x += (font.chars[line[i]].xadvance || 0) + kerning;
      } else {
        var unkkerning = font.kernings['?'] && font.kernings['?'][line[i + 1]] ? font.kernings['?'][line[i + 1]] : 0;
        x += (font.chars['?'].xadvance || 0) + unkkerning;
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