var map = []
var plus_map = [""]
var minus_map = [""]
var iter = !0

for (map, plus_map, minus_map, iter, i = 1; 256 > i; i++) plus_map[i] = plus_map[i - 1] + "+", minus_map[i] = minus_map[i - 1] + "-";

for (var x = 0; 256 > x; x++) {
    map[x] = [];
    for (var y = 0; 256 > y; y++) {
        var delta = y - x;
        128 < delta && (delta -= 256); - 128 > delta && (delta += 256);
        map[x][y] = 0 <= delta ? plus_map[delta] : minus_map[-delta]
    }
}

function next() {
    iter = !1;
    for (var c = 0; 256 > c; c++)
        for (var a = 1; 40 > a; a++)
            for (var f = inverse_mod(a, 256) & 255, d = 1; 40 > d; d++)
                if (1 == gcd(a, d)) {
                    if (a & 1) {
                        var b = 0;
                        var e = c * f & 255
                    } else
                        for (b = c, e = 0; 256 > e && b; e++) b = b - a & 255;
                    0 == b && (b = d * e & 255, a + d + 5 < map[c][b].length && (map[c][b] = "[" + minus_map[a] + ">" + plus_map[d] + "<]>"));
                    if (a & 1) b = 0, e = -c * f & 255;
                    else
                        for (b = c, e = 0; 256 > e && b; e++) b = b + a & 255;
                    0 == b && (b = -d * e & 255, a + d + 5 < map[c][b].length && (map[c][b] = "[" + plus_map[a] + ">" + minus_map[d] + "<]>"))
                } for (c = 0; 256 > c; c++)
        for (a = map[c], e = 0; 256 > e; e++)
            for (f = map[e],
                d = a[e], b = 0; 256 > b; b++) d.length + f[b].length < a[b].length && (a[b] = d + f[b]);
}

function gcd(c, a) {
    return 0 === a ? c : gcd(a, c % a)
}

function inverse_mod(c, a) {
    for (var f = 1, d = 0, b; a;) b = f, f = d, d = b - d * (c / a | 0), b = c, c = a, a = b % a;
    return f
}

next()

module.exports = function (inp) {
    function shortest_str(c) {
        console.log(c.length)
        for (var a = 0, f = 1; f < c.length; f++) c[f].length < c[a].length && (a = f);
        return a
    }

    function generate(c) {
        for (var a = 0, f = c.length, d = "", b = 0; b < f; b++) {
            var e = c.charCodeAt(b) & 255;
            a = [">" + map[0][e], map[a][e]];
            var g = shortest_str(a);
            d += a[g] + ".";
            a = e
        }
        return d
    }

    function do_generate(inp) {
        a = generate(inp);
        return a;
    }

    return do_generate(inp)
};
