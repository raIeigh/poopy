(async () => {
    var ton = document.getElementById('ton')

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    ton.addEventListener('click', () => {
        document.body.innerHTML = 'winer.'
    })

    while (ton) {
        ton.style.top = `${Math.floor(Math.random() * 10001) / 100}%`
        ton.style.left = `${Math.floor(Math.random() * 10001) / 100}%`
        await sleep(100)
    }
})()