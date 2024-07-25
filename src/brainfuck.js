module.exports = async function (c) {
    var y = '',
        z = c.length,
        v = 32768,
        a = new Array(v),
        p = 0,
        k = -1,
        e = new Array(z),
        l = new Array(z),
        s = new Array(z),
        m = 127,
        n = -128,
        large = false,
        out = "",
        iteractions = 0
    if (large) {
        m = Number.MAX_VALUE;
        n = -(Number.MAX_VALUE)
    }
    for (j = 0; j < v; j++) {
        a[j] = 0
    }
    for (j = 0; j < z && p >= 0; j++) {
        if (c.charAt(j) == '[') l[++p] = j;
        if (c.charAt(j) == ']') {
            s[j] = l[p];
            e[l[p]] = j;
            p--
        }
    }
    if (p != 0) {
        return "Unbalanced brackets!"
    }
    for (j = 0; j < z; j++) {
        switch (c.charAt(j)) {
            case '#':
                return 'Position within code: ' + j + '\nPointer: ' + p + '\nValue at pointer: ' + a[p]
            case '<':
                p--;
                if (p < 0) p = v - 1;
                break
            case '>':
                p++;
                if (p >= v) p = 0;
                break
            case '+':
                if ((a[p] + 1) > m) a[p] = n;
                else {
                    a[p]++
                };
                break
            case '-':
                if ((a[p] - 1) < n) a[p] = m;
                else {
                    a[p]--
                };
                break
            case ']':
                j = s[j]
            case '[':
                if (a[p] == 0) j = e[j];
                break
            case ',':
                if (k + 1 >= y.length) {
                    j = z
                    break
                }
                a[p] = y.charCodeAt(++k);
                break
            case '.':
                out += String.fromCharCode(a[p])
        }
        iteractions++
        if (iteractions > 1000000) break
    }
    return out
}