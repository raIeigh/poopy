module.exports = function (str) {
    var nchars = str.length;
    var lev = 6
    var out = ""
    var ichar
    var chr

    // Pick a random starting character, preferably an uppercase letter.
    for (var i = 0; i < nchars; i++) {
        ichar = Math.floor(nchars * Math.random());
        chr = str.charAt(ichar);
        if ((chr >= "A") && (chr <= "Z")) break;
    }

    // Write starting characters.
    out += str.substring(ichar, ichar + lev);

    // Set target string.
    var target = str.substring(ichar + 1, ichar + lev);

    // Generate characters.
    // Algorithm: Letter-based Markov text generator.
    for (var i = 0; i < nchars; i++) {
        if (lev == 1) {
            // Pick a random character.
            chr = str.charAt(Math.floor(nchars * Math.random()));
        } else {
            // Find all sets of matching target characters.
            nmatches = 0;
            var j = -1;
            while (true) {
                j = str.indexOf(target, j + 1)
                if ((j < 0) || (j >= nchars)) {
                    break;
                } else {
                    nmatches++;
                }
            }

            // Pick a match at random.
            imatch = Math.floor(nmatches * Math.random());

            // Find the character following the matching characters.
            nmatches = 0
            j = -1
            while (true) {
                j = str.indexOf(target, j + 1)
                if ((j < 0) || (j >= nchars)) {
                    break;
                } else if (imatch == nmatches) {
                    chr = str.charAt(j + lev - 1);
                    break;
                } else {
                    nmatches++;
                }
            }
        }

        // Output the character.
        out += chr;

        // Update the target.
        if (lev > 1) {
            target = target.substring(1, lev - 1) + chr;
        }
    }

    return out
}