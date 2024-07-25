module.exports = function () {
    var IpStart = "0.0.0.0";

    var IpEnd = "255.255.255.255";

    function randRange(low, high) { return parseInt(parseInt(low, 10) + Math.random() * (parseInt(high, 10) - parseInt(low, 10) + 1), 10).toString(); }

    var r1 = randRange(IpStart.split('.')[0], IpEnd.split('.')[0]);
    var r2 = randRange(IpStart.split('.')[1], IpEnd.split('.')[1]);
    var r3 = randRange(IpStart.split('.')[2], IpEnd.split('.')[2]);
    var r4 = randRange(IpStart.split('.')[3], IpEnd.split('.')[3]);

    return r1 + '.' + r2 + '.' + r3 + '.' + r4;
}